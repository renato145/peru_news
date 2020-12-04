use serde::{Deserialize, Serialize};
use scraper::ElementRef;

#[derive(Debug, Serialize, Deserialize)]
pub struct Headline {
    pub title: String,
    pub url: Option<String>,
}

impl Headline {
    pub fn new(title: &str, url: Option<&str>) -> Headline {
        let title = match title {
            "" => url.unwrap_or(""),
            title => title,
        }
        .to_owned();
        let url = url.map(String::from);
        Headline { title, url }
    }

    pub fn add_baseurl(mut self, baseurl: &str) -> Headline {
        let baseurl = baseurl.trim_end_matches("/");
        self.url = self.url.map(|url| format!("{}{}", baseurl, url));
        self
    }
}

impl From<ElementRef<'_>> for Headline {
    fn from(element: ElementRef) -> Self {
        let title = element.text().collect::<Vec<_>>().join(" ");
        let url = element.value().attr("href");
        Headline::new(&title, url)
    }
}

