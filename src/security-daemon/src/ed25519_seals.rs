use parking_lot::RwLock;
use std::collections::HashMap;
use std::time::{Duration, Instant};

#[derive(Debug, Clone)]
struct Bucket {
    tokens: f64,
    last_update: Instant,
    failed_attempts: u32,
    quarantined_until: Option<Instant>,
}

pub struct TokenBucketRateLimiter {
    capacity: f64,
    refill_rate_per_sec: f64,
    max_failed_attempts: u32,
    quarantine_duration: Duration,
    buckets: RwLock<HashMap<String, Bucket>>,
}

impl TokenBucketRateLimiter {
    pub fn new(capacity: f64, refill_rate_per_sec: f64, max_failed_attempts: u32, quarantine_secs: u64) -> Self {
        Self {
            capacity,
            refill_rate_per_sec,
            max_failed_attempts,
            quarantine_duration: Duration::from_secs(quarantine_secs),
            buckets: RwLock::new(HashMap::new()),
        }
    }

    pub fn check_request(&self, ip: &str) -> (bool, f64, bool) {
        let mut buckets = self.buckets.write();
        let now = Instant::now();

        let bucket = buckets.entry(ip.to_string()).or_insert_with(|| Bucket {
            tokens: self.capacity,
            last_update: now,
            failed_attempts: 0,
            quarantined_until: None,
        });

        if let Some(until) = bucket.quarantined_until {
            if now < until {
                return (false, 0.0, true);
            } else {
                bucket.quarantined_until = None;
                bucket.failed_attempts = 0;
            }
        }

        let elapsed = now.duration_since(bucket.last_update).as_secs_f64();
        bucket.tokens = (bucket.tokens + elapsed * self.refill_rate_per_sec).min(self.capacity);
        bucket.last_update = now;

        if bucket.tokens >= 1.0 {
            bucket.tokens -= 1.0;
            (true, bucket.tokens, false)
        } else {
            (false, 0.0, false)
        }
    }

    pub fn record_auth_failure(&self, ip: &str) -> (u32, bool) {
        let mut buckets = self.buckets.write();
        let now = Instant::now();

        let bucket = buckets.entry(ip.to_string()).or_insert_with(|| Bucket {
            tokens: self.capacity,
            last_update: now,
            failed_attempts: 0,
            quarantined_until: None,
        });

        bucket.failed_attempts += 1;
        if bucket.failed_attempts >= self.max_failed_attempts {
            bucket.quarantined_until = Some(now + self.quarantine_duration);
            (bucket.failed_attempts, true)
        } else {
            (bucket.failed_attempts, false)
        }
    }
}