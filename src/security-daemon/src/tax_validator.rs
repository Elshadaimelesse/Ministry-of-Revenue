use rayon::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DeclarationItem {
    pub taxpayer_tin: String,
    pub business_category: String, // "Category A", "Category B", "Category C"
    pub declared_gross_turnover: f64,
    pub reported_expenses: f64,
    pub claimed_withholding_credit: f64,
    pub vat_registered: bool,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ValidationResult {
    pub taxpayer_tin: String,
    pub is_valid: bool,
    pub audited_taxable_net: f64,
    pub assessed_tax_etb: f64,
    pub anomaly_flag: Option<String>,
    pub confidence_score: f64,
}

pub struct EthiopianTaxValidator;

impl EthiopianTaxValidator {
    /// Validates batch declarations in parallel across CPU cores using Rayon
    pub fn validate_batch(items: Vec<DeclarationItem>) -> Vec<ValidationResult> {
        items
            .into_par_iter()
            .map(|item| Self::validate_single(&item))
            .collect()
    }

    /// Validates an individual declaration according to FDRE Proclamation No. 979/2016
    pub fn validate_single(item: &DeclarationItem) -> ValidationResult {
        // Sanity & Bounds Checks (Memory safety: prevent NaN / Negative overflow)
        if item.declared_gross_turnover.is_nan() || item.declared_gross_turnover < 0.0 {
            return ValidationResult {
                taxpayer_tin: item.taxpayer_tin.clone(),
                is_valid: false,
                audited_taxable_net: 0.0,
                assessed_tax_etb: 0.0,
                anomaly_flag: Some("Invalid negative or NaN turnover reported".to_string()),
                confidence_score: 0.0,
            };
        }

        // Mandatory VAT Registration check (> 1,000,000 ETB per annum)
        if item.declared_gross_turnover >= 1_000_000.0 && !item.vat_registered {
            return ValidationResult {
                taxpayer_tin: item.taxpayer_tin.clone(),
                is_valid: false,
                audited_taxable_net: item.declared_gross_turnover - item.reported_expenses,
                assessed_tax_etb: item.declared_gross_turnover * 0.15,
                anomaly_flag: Some("Mandatory VAT registration threshold breached without VAT registration".to_string()),
                confidence_score: 0.95,
            };
        }

        // Category A Check: High expense-to-revenue ratio anomaly
        if item.business_category == "Category A" && item.reported_expenses > item.declared_gross_turnover * 0.95 {
            return ValidationResult {
                taxpayer_tin: item.taxpayer_tin.clone(),
                is_valid: true,
                audited_taxable_net: item.declared_gross_turnover - item.reported_expenses,
                assessed_tax_etb: Self::calculate_schedule_c_business_tax(item.declared_gross_turnover - item.reported_expenses),
                anomaly_flag: Some("High expense-to-revenue ratio (>95%): manual audit recommended".to_string()),
                confidence_score: 0.82,
            };
        }

        let taxable_net = (item.declared_gross_turnover - item.reported_expenses).max(0.0);
        let assessed_tax = Self::calculate_schedule_c_business_tax(taxable_net);

        ValidationResult {
            taxpayer_tin: item.taxpayer_tin.clone(),
            is_valid: true,
            audited_taxable_net: taxable_net,
            assessed_tax_etb: assessed_tax,
            anomaly_flag: None,
            confidence_score: 0.99,
        }
    }

    fn calculate_schedule_c_business_tax(net_profit: f64) -> f64 {
        if net_profit <= 7_200.0 {
            0.0
        } else if net_profit <= 19_800.0 {
            (net_profit * 0.10) - 720.0
        } else if net_profit <= 38_400.0 {
            (net_profit * 0.15) - 1_710.0
        } else if net_profit <= 63_000.0 {
            (net_profit * 0.20) - 3_630.0
        } else if net_profit <= 93_600.0 {
            (net_profit * 0.25) - 6_780.0
        } else if net_profit <= 130_800.0 {
            (net_profit * 0.30) - 11_460.0
        } else {
            (net_profit * 0.35) - 18_000.0
        }
    }
}