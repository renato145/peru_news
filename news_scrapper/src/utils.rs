use chrono::{DateTime, FixedOffset, Local, Utc};

pub fn get_peru_time() -> DateTime<FixedOffset> {
    let now = Local::now();
    let utc_time: DateTime<Utc> = DateTime::from_utc(now.naive_utc(), Utc);
    let peru_tz = FixedOffset::west(5 * 3600);
    utc_time.with_timezone(&peru_tz)
}