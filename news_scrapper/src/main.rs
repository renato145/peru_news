use news_scrapper::scrape_web;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let url = "https://elcomercio.pe/ultimas-noticias/";
    let selector = ".primary-font";
    let data = scrape_web(url, selector).await?;
    println!("{}", serde_json::to_string(&data)?);
    Ok(())
}
