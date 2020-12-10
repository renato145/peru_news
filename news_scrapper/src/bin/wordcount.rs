use anyhow::Result;
use news_scrapper::{Config, wordcount_all};
use std::env;

#[tokio::main]
async fn main() -> Result<()> {
    // todo: process/filter words
    let config = Config::from_args(env::args())?;
    wordcount_all(config).await?;
    Ok(())
}
