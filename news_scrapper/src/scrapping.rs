use super::Headline;
use scraper::{Html, Selector};

pub async fn scrape_web(url: &str, selector: &str) -> Result<Vec<Headline>, Box<dyn std::error::Error>> {
    let body = reqwest::get(url).await?.text().await?;
    let document = Html::parse_document(&body);
    let selector = Selector::parse(selector).unwrap();

    let data: Vec<_> = document
        .select(&selector)
        .map(Headline::from)
        .filter(|headline| headline.title != "")
        .map(|headline| headline.add_baseurl(url))
        .collect();

    Ok(data)
}
