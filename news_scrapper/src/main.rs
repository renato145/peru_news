use anyhow::Result;
use news_scrapper::{scrape_all, Config};
use std::env;

#[tokio::main]
async fn main() -> Result<()> {
    let config = Config::from_args(env::args())?;
    scrape_all(config).await?;
    Ok(())
}
