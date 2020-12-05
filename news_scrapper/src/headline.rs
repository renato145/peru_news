use scraper::ElementRef;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Headline {
    pub title: String,
    pub url: String,
}

impl Headline {
    pub fn new(title: &str, url: &str) -> Headline {
        let title = match title {
            "" => url,
            title => title.trim(),
        }
        .to_owned();
        Headline {
            title,
            url: url.into(),
        }
    }

    pub fn add_baseurl(mut self, baseurl: &str) -> Headline {
        let baseurl = baseurl.trim_end_matches("/");
        if !self.url.starts_with(baseurl) {
            self.url = format!("{}{}", baseurl, self.url);
        }
        self
    }

    pub fn from_element(element: ElementRef) -> Option<Self> {
        let title = element.text().collect::<Vec<_>>().join(" ");
        let url = element.value().attr("href")?;
        Some(Headline::new(&title, url))
    }
}
