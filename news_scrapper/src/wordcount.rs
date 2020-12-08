use anyhow::{anyhow, Result};
use std::{
    collections::HashMap,
    fs::File,
    path::{Path, PathBuf},
    sync::{Arc, Mutex},
};

use crate::{headlines_from_path, Config};

type WordCount = HashMap<String, usize>;

pub fn wordcount(path: &PathBuf) -> Result<WordCount> {
    let data = headlines_from_path(path)?;
    let mut words = HashMap::new();
    for headline in data {
        for word in headline.title.split(' ') {
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

pub async fn wordcount_folder(path: &PathBuf) -> Result<usize> {
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
    data.lock()
        .map(|data| {
            let mut path = path.clone();
            path.push("summary.json");

            save_results(&data, path);
            data.len()
        })
        .map_err(|err| anyhow!("{}", err))
}

pub async fn wordcount_all(config: Config) -> Result<()> {
    let out_path = Path::new(&config.out_path);
    let msg = format!("Word counting from folder {:?}:", out_path.display());
    println!("{}\n{}", msg, "-".repeat(msg.len()));

    let handlers = out_path
        .read_dir()?
        .filter_map(Result::ok)
        .map(|o| o.path())
        .filter(|o| o.is_dir())
        .map(|day_path| {
            tokio::spawn(async move {
                match wordcount_folder(&day_path).await {
                    Ok(n) => println!("{:?} done ({} files)", day_path.display(), n),
                    Err(err) => println!("Error retrieving {:?}: {}", day_path.display(), err),
                };
            })
        });

    futures::future::join_all(handlers).await;
    println!("Done! :)");
    Ok(())
}
