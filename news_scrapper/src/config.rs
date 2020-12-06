use anyhow::{Context, Result};
use serde::{Deserialize, Serialize};
use std::{fs::File, io::BufReader};

#[derive(Debug, Serialize, Deserialize)]
pub struct SiteConfig {
    pub name: String,
    pub url: String,
    pub selector: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub out_path: String,
    pub sources: Vec<SiteConfig>,
}

impl Config {
    pub fn from_args(mut args: std::env::Args) -> Result<Config> {
        args.next();
        let filename = args.next().context("No file given")?;
        let file = File::open(filename)?;
        let reader = BufReader::new(file);
        let cfg = serde_json::from_reader(reader)?;
        Ok(cfg)
    }
}
