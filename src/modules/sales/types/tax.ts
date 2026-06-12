export interface TaxConfiguration {
  companyCen:          string
  globalTaxPercentage: number
}

export interface UpdateTaxConfigurationRequest {
  globalTaxPercentage: number
}