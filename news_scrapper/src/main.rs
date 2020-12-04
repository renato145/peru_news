use scraper::{Html, Selector};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
struct Headline {
    title: String,
    url: Option<String>
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>>{
    let url = "https://elcomercio.pe/ultimas-noticias/";
    let body = reqwest::get(url).await?.text().await?;
    let document = Html::parse_document(&body);
    let selector = Selector::parse(".primary-font").unwrap();

    for element in document.select(&selector) {
        let title = element.text().collect::<Vec<_>>().join(" ");
        let url = element.value().attr("href").map(String::from);
        let headline = Headline { title, url };
        let data = serde_json::to_string(&headline)?;
        println!("{}", data);
        println!("----------------------------")
    }

    Ok(())
}
