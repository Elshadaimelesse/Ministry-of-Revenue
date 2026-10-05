use serde::Serialize;

#[derive(Serialize)]
pub struct ScanResult {
    pub is_valid_pdf: bool,
    pub malware_free: bool,
    pub byte_length: usize,
    pub sha256: String,
    pub status: &'static str,
}

pub fn scan_uploaded_buffer(buffer: &[u8]) -> ScanResult {
    let sha256 = crate::crypto::compute_ring_sha256(buffer).sha256_hex;
    let is_pdf = buffer.starts_with(b"%PDF-");
    let has_js = buffer.windows(3).any(|w| w == b"/JS" || w == b"/JavaScript");

    ScanResult {
        is_valid_pdf: is_pdf,
        malware_free: !has_js,
        byte_length: buffer.len(),
        sha256,
        status: if is_pdf && !has_js {
            "SAFE_FOR_AUDIT"
        } else {
            "QUARANTINED"
        },
    }
}