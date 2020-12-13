use anyhow::{bail, Result};
use lazy_static::lazy_static;
use regex::Regex;
use std::{
    collections::HashMap,
    fs::File,
    path::{Path, PathBuf},
    sync::{Arc, Mutex},
};

use crate::{headlines_from_path, Config};

lazy_static! {
    static ref RE: Regex = Regex::new(r"(?:[[:alpha:]ÁÉÍÓÚÑáéíóúñ]{3,})").unwrap();
    static ref STOP_WORDS: Vec<String> = String::from_utf8_lossy(include_bytes!("spanish"))
        .split("\n")
        .map(|o| o.into())
        .collect();
}

fn process_text(text: &String) -> Vec<String> {
    RE.find_iter(text)
        .map(|o| o.as_str().to_string())
        .filter(|o| !STOP_WORDS.contains(&o.to_lowercase()))
        .collect()
}

type WordCount = HashMap<String, usize>;

pub fn wordcount(path: &PathBuf) -> Result<WordCount> {
    let data = headlines_from_path(path)?;
    let mut words = HashMap::new();
    for headline in data {
        for word in process_text(&headline.title) {
            let n = words.entry(word.into()).or_insert(0 as usize);
            *n += 1;
        }
    }
    Ok(words)
}

type WordCountCollection = HashMap<String, WordCount>;

fn save_results(data: &WordCountCollection, path: &PathBuf) -> Result<()> {
    let file = File::create(path)?;
    serde_json::to_writer_pretty(file, data)?;
    Ok(())
}

pub async fn wordcount_folder(path: &PathBuf, save_path: &PathBuf) -> Result<usize> {
    let data: Arc<Mutex<WordCountCollection>> = Arc::new(Mutex::new(HashMap::new()));

    let handlers = path
        .read_dir()?
        .filter_map(Result::ok)
        .map(|o| o.path())
        .filter(|o| o.extension().unwrap_or_default() == "json")
        .map(|json_file| {
            let data = data.clone();
            tokio::spawn(async move {
                match wordcount(&json_file) {
                    Ok(words) => {
                        let mut data = data.lock().unwrap();
                        let fname = json_file
                            .file_stem()
                            .and_then(|o| o.to_str())
                            .unwrap_or_default();
                        data.insert(fname.into(), words);
                    }
                    Err(err) => println!("Error on path {:?}: {}", json_file, err),
                };
            })
        });

    futures::future::join_all(handlers).await;

    let res = match data.lock() {
        Ok(data) => {
            save_results(&data, &save_path)?;
            Ok(data.len())
        }
        Err(err) => bail!("{}", err),
    };
    res
}

pub async fn wordcount_all(config: Config) -> Result<()> {
    let out_path = Path::new(&config.out_path);
    let mut summary_path = out_path.to_path_buf();
    summary_path.push("summary");
    std::fs::create_dir_all(&summary_path).unwrap();
    let msg = format!("Word counting from folder {:?}:", out_path.display());
    println!("{}\n{}", msg, "-".repeat(msg.len()));

    let mut handlers: Vec<_> = out_path
        .read_dir()?
        .filter_map(Result::ok)
        .map(|o| (o.path(), o.file_name()))
        .filter(|(path, name)| path.is_dir() && name != "summary" && name != "")
        .collect();

    handlers.sort_by(|a, b| b.1.as_os_str().cmp(&a.1.as_os_str()));

    let handlers = handlers.drain(1..).filter_map(|(day_path, day_name)| {
        let mut save_path = summary_path.clone();
        save_path.push(day_name);
        save_path.set_extension("json");
        if save_path.exists() {
            None
        } else {
            Some(tokio::spawn(async move {
                match wordcount_folder(&day_path, &save_path).await {
                    Ok(n) => println!("{:?} done ({} files)", day_path.display(), n),
                    Err(err) => println!("Error retrieving {:?}: {}", day_path.display(), err),
                };
            }))
        }
    });

    futures::future::join_all(handlers).await;
    println!("Done! :)");
    Ok(())
}
