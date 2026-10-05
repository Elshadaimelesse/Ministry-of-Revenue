use crate::crypto::compute_ring_sha256;
use chrono::Utc;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditTransaction {
    pub tx_id: String,
    pub case_id: String,
    pub actor: String,
    pub role: String,
    pub action: String,
    pub payload_hash: String,
    pub timestamp: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AuditBlock {
    pub index: u64,
    pub timestamp: String,
    pub previous_hash: String,
    pub merkle_root: String,
    pub current_hash: String,
    pub transactions: Vec<AuditTransaction>,
}

pub struct AuditChain {
    pub blocks: Vec<AuditBlock>,
}

impl AuditChain {
    pub fn new() -> Self {
        let mut chain = Self { blocks: Vec::new() };
        chain.create_genesis_block();
        chain
    }

    fn create_genesis_block(&mut self) {
        let genesis_tx = AuditTransaction {
            tx_id: "GENESIS-TX-0000".to_string(),
            case_id: "ETH-MINISTRY-ROOT".to_string(),
            actor: "GOVREVENUE-GENESIS".to_string(),
            role: "superadmin".to_string(),
            action: "INITIALIZE_REVENUE_LEDGER".to_string(),
            payload_hash: "0000000000000000000000000000000000000000000000000000000000000000".to_string(),
            timestamp: "2026-01-01T00:00:00Z".to_string(),
        };

        let merkle = Self::compute_merkle_root(&[genesis_tx.clone()]);
        let block_header = format!("0-{}-0000000000000000000000000000000000000000000000000000000000000000-{}", 
            genesis_tx.timestamp, merkle);
        let block_hash = compute_ring_sha256(block_header.as_bytes()).sha256_hex;

        let genesis_block = AuditBlock {
            index: 0,
            timestamp: genesis_tx.timestamp.clone(),
            previous_hash: "0000000000000000000000000000000000000000000000000000000000000000".to_string(),
            merkle_root: merkle,
            current_hash: block_hash,
            transactions: vec![genesis_tx],
        };

        self.blocks.push(genesis_block);
    }

    /// Computes cryptographic Merkle tree root from a slice of audit transactions
    pub fn compute_merkle_root(txs: &[AuditTransaction]) -> String {
        if txs.is_empty() {
            return "0000000000000000000000000000000000000000000000000000000000000000".to_string();
        }

        let mut hashes: Vec<String> = txs
            .iter()
            .map(|tx| {
                let raw = format!("{}:{}:{}:{}", tx.tx_id, tx.actor, tx.action, tx.payload_hash);
                compute_ring_sha256(raw.as_bytes()).sha256_hex
            })
            .collect();

        while hashes.len() > 1 {
            let mut next_level = Vec::new();
            for chunk in hashes.chunks(2) {
                if chunk.len() == 2 {
                    let concat = format!("{}{}", chunk[0], chunk[1]);
                    next_level.push(compute_ring_sha256(concat.as_bytes()).sha256_hex);
                } else {
                    let concat = format!("{}{}", chunk[0], chunk[0]);
                    next_level.push(compute_ring_sha256(concat.as_bytes()).sha256_hex);
                }
            }
            hashes = next_level;
        }

        hashes[0].clone()
    }

    /// Appends a new immutable block of transactions to the chain
    pub fn append_block(&mut self, txs: Vec<AuditTransaction>) -> AuditBlock {
        let prev_block = self.blocks.last().expect("Genesis block must exist");
        let merkle = Self::compute_merkle_root(&txs);
        let now = Utc::now().to_rfc3339();

        let header = format!("{}-{}-{}-{}", prev_block.index + 1, now, prev_block.current_hash, merkle);
        let current_hash = compute_ring_sha256(header.as_bytes()).sha256_hex;

        let block = AuditBlock {
            index: prev_block.index + 1,
            timestamp: now,
            previous_hash: prev_block.current_hash.clone(),
            merkle_root: merkle,
            current_hash,
            transactions: txs,
        };

        self.blocks.push(block.clone());
        block
    }

    /// Cryptographically validates the entire audit chain from genesis to head
    pub fn validate_entire_chain(&self) -> (bool, Option<u64>) {
        for i in 1..self.blocks.len() {
            let prev = &self.blocks[i - 1];
            let curr = &self.blocks[i];

            if curr.previous_hash != prev.current_hash {
                return (false, Some(curr.index));
            }

            let computed_merkle = Self::compute_merkle_root(&curr.transactions);
            if curr.merkle_root != computed_merkle {
                return (false, Some(curr.index));
            }

            let header = format!("{}-{}-{}-{}", curr.index, curr.timestamp, curr.previous_hash, curr.merkle_root);
            let computed_hash = compute_ring_sha256(header.as_bytes()).sha256_hex;
            if curr.current_hash != computed_hash {
                return (false, Some(curr.index));
            }
        }
        (true, None)
    }
}