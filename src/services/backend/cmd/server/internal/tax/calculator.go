package tax

// EthiopianTaxEngine calculates taxes per Proclamation No. 979/2016
type EthiopianTaxEngine struct{}

func NewEthiopianTaxEngine() *EthiopianTaxEngine {
	return &EthiopianTaxEngine{}
}

type TaxResult struct {
	Gross        float64 `json:"gross"`
	TaxETB       float64 `json:"tax_etb"`
	Pension      float64 `json:"pension_etb"`
	Net          float64 `json:"net_etb"`
	StatutoryLaw string  `json:"statutory_citation"`
}

func (e *EthiopianTaxEngine) Compute(schedule string, gross float64) TaxResult {
	if schedule == "VAT" {
		vat := gross * 0.15
		return TaxResult{
			Gross: gross, TaxETB: vat, Net: gross + vat,
			StatutoryLaw: "VAT Proclamation No. 285/2002 (15%)",
		}
	}

	var tax float64
	if gross > 10900 {
		tax = (gross * 0.35) - 1500
	} else if gross > 7800 {
		tax = (gross * 0.30) - 955
	} else if gross > 5250 {
		tax = (gross * 0.25) - 565
	} else if gross > 3200 {
		tax = (gross * 0.20) - 302.5
	} else if gross > 1650 {
		tax = (gross * 0.15) - 142.5
	} else if gross > 600 {
		tax = (gross * 0.10) - 60
	}

	pension := gross * 0.07
	return TaxResult{
		Gross: gross, TaxETB: tax, Pension: pension, Net: gross - tax - pension,
		StatutoryLaw: "Income Tax Proclamation No. 979/2016 Schedule A",
	}
}