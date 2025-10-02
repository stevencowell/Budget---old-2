/**
 * Financial Constants for Superannuation and Retirement Planning
 * 
 * This file contains all hardcoded financial values, rates, and limits
 * used throughout the application. Values are current as of 2025.
 */

// === TAX RATES ===
export const TAX_RATES = {
  // Superannuation contribution tax rate
  SUPER_CONTRIBUTIONS: 0.15, // 15%
  SUPER_CONTRIBUTIONS_PERCENTAGE: 15,
  
  // Division 293 tax threshold
  DIVISION_293_THRESHOLD: 250000,
  DIVISION_293_ADDITIONAL_TAX: 0.15, // Additional 15%
  
  // Medicare levy
  MEDICARE_LEVY: 0.02, // 2%
  
  // Individual marginal tax rates (2024-25)
  MARGINAL_RATES: [
    { min: 0, max: 18200, rate: 0 },
    { min: 18201, max: 45000, rate: 0.19 },
    { min: 45001, max: 120000, rate: 0.325 },
    { min: 120001, max: 180000, rate: 0.37 },
    { min: 180001, max: Infinity, rate: 0.45 }
  ]
};

// === SUPERANNUATION RATES ===
export const SUPER_RATES = {
  // Superannuation guarantee rate (employer contribution)
  GUARANTEE_RATE: 0.115, // 11.5% for 2025
  GUARANTEE_PERCENTAGE: 11.5,
  
  // For calculations using 11% (current common rate in examples)
  EMPLOYER_CONTRIBUTION_RATE: 0.11, // 11%
  EMPLOYER_CONTRIBUTION_PERCENTAGE: 11
};

// === CONTRIBUTION CAPS ===
export const CONTRIBUTION_CAPS = {
  // Annual concessional (before-tax) contribution cap
  CONCESSIONAL: 27500, // $27,500 per year (2025)
  
  // Annual non-concessional (after-tax) contribution cap
  NON_CONCESSIONAL: 110000, // $110,000 per year
  
  // Bring-forward cap (3 years of non-concessional)
  BRING_FORWARD: 330000 // $330,000
};

// === TIME PERIODS ===
export const TIME_PERIODS = {
  // Working days and periods
  WORKING_DAYS_PER_YEAR: 260,
  FORTNIGHTS_PER_YEAR: 26,
  WEEKS_PER_YEAR: 52,
  MONTHS_PER_YEAR: 12,
  
  // Standard work week
  FULL_TIME_DAYS_PER_WEEK: 5,
  FULL_TIME_HOURS_PER_WEEK: 38
};

// === AGE THRESHOLDS ===
export const AGE_THRESHOLDS = {
  // Preservation age (when you can access super)
  PRESERVATION_AGE: 60,
  
  // Age pension eligibility
  PENSION_AGE: 67,
  
  // Tax-free threshold age for super withdrawals
  TAX_FREE_WITHDRAWAL_AGE: 60,
  
  // Common retirement ages
  EARLY_RETIREMENT: 55,
  STANDARD_RETIREMENT: 60,
  LATE_RETIREMENT: 65,
  
  // Life expectancy
  DEFAULT_LIFE_EXPECTANCY: 90
};

// === MINIMUM DRAWDOWN RATES ===
// Minimum pension withdrawal rates by age (account-based pensions)
export const MINIMUM_DRAWDOWN_RATES = [
  { minAge: 0, maxAge: 64, rate: 0.04, percentage: 4 },
  { minAge: 65, maxAge: 74, rate: 0.05, percentage: 5 },
  { minAge: 75, maxAge: 79, rate: 0.06, percentage: 6 },
  { minAge: 80, maxAge: 84, rate: 0.07, percentage: 7 },
  { minAge: 85, maxAge: 89, rate: 0.09, percentage: 9 },
  { minAge: 90, maxAge: 94, rate: 0.11, percentage: 11 },
  { minAge: 95, maxAge: Infinity, rate: 0.14, percentage: 14 }
];

// === DEFAULT INVESTMENT ASSUMPTIONS ===
export const INVESTMENT_DEFAULTS = {
  // Expected returns
  RETURN_RATE: 7.0, // 7% annual return
  RETURN_RATE_CONSERVATIVE: 5.0,
  RETURN_RATE_BALANCED: 7.0,
  RETURN_RATE_GROWTH: 9.0,
  
  // Inflation
  INFLATION_RATE: 2.5, // 2.5% annual inflation
  INFLATION_RATE_CONSERVATIVE: 3.0,
  INFLATION_RATE_MODERATE: 2.5,
  INFLATION_RATE_OPTIMISTIC: 2.0,
  
  // Fees
  ADMIN_FEES: 0.6, // 0.6% annual admin fees
  ADMIN_FEES_LOW: 0.3,
  ADMIN_FEES_STANDARD: 0.6,
  ADMIN_FEES_HIGH: 1.0
};

// === RETIREMENT INCOME RULES ===
export const RETIREMENT_INCOME = {
  // The "4% rule" for sustainable retirement withdrawals
  FOUR_PERCENT_RULE: 0.04,
  
  // Conservative withdrawal rates
  CONSERVATIVE_RATE: 0.03,
  MODERATE_RATE: 0.04,
  AGGRESSIVE_RATE: 0.05,
  
  // Standard retirement duration
  STANDARD_DURATION_YEARS: 30
};

// === HELPER FUNCTIONS ===

/**
 * Get the minimum drawdown rate for a given age
 * @param {number} age - The person's age
 * @returns {object} Object containing rate (decimal) and percentage
 */
export const getMinimumDrawdownRate = (age) => {
  const bracket = MINIMUM_DRAWDOWN_RATES.find(
    (bracket) => age >= bracket.minAge && age <= bracket.maxAge
  );
  return bracket || MINIMUM_DRAWDOWN_RATES[MINIMUM_DRAWDOWN_RATES.length - 1];
};

/**
 * Calculate the marginal tax rate for a given income
 * @param {number} income - Annual income
 * @returns {number} Marginal tax rate as decimal (e.g., 0.37 for 37%)
 */
export const getMarginalTaxRate = (income) => {
  const bracket = TAX_RATES.MARGINAL_RATES.find(
    (bracket) => income >= bracket.min && income <= bracket.max
  );
  return bracket ? bracket.rate : TAX_RATES.MARGINAL_RATES[TAX_RATES.MARGINAL_RATES.length - 1].rate;
};

/**
 * Convert decimal rate to percentage for display
 * @param {number} rate - Rate as decimal (e.g., 0.15)
 * @returns {string} Formatted percentage (e.g., "15%")
 */
export const formatPercentage = (rate) => {
  return `${(rate * 100).toFixed(2)}%`;
};

/**
 * Calculate net return rate after fees and inflation
 * @param {number} returnRate - Annual return rate as percentage
 * @param {number} adminFees - Annual admin fees as percentage
 * @param {number} inflationRate - Annual inflation rate as percentage (optional)
 * @returns {number} Net return rate as decimal
 */
export const calculateNetReturnRate = (returnRate, adminFees, inflationRate = 0) => {
  return (returnRate - adminFees - inflationRate) / 100;
};

/**
 * Calculate daily salary based on annual salary
 * @param {number} annualSalary - Annual salary
 * @param {number} workingDays - Working days per year (default 260)
 * @returns {number} Daily salary
 */
export const calculateDailySalary = (annualSalary, workingDays = TIME_PERIODS.WORKING_DAYS_PER_YEAR) => {
  return annualSalary / workingDays;
};

/**
 * Calculate part-time ratio
 * @param {number} daysPerWeek - Days working per week
 * @returns {number} Part-time ratio as decimal (e.g., 0.8 for 4 days/week)
 */
export const calculatePartTimeRatio = (daysPerWeek) => {
  return daysPerWeek / TIME_PERIODS.FULL_TIME_DAYS_PER_WEEK;
};

/**
 * Calculate long service leave super contribution
 * @param {number} lslDays - Long service leave days
 * @param {number} annualSalary - Annual salary
 * @returns {number} Super contribution from LSL
 */
export const calculateLSLSuperContribution = (lslDays, annualSalary) => {
  const dailySalary = calculateDailySalary(annualSalary);
  const lslPay = dailySalary * lslDays;
  return lslPay * SUPER_RATES.EMPLOYER_CONTRIBUTION_RATE;
};

const financialConstants = {
  TAX_RATES,
  SUPER_RATES,
  CONTRIBUTION_CAPS,
  TIME_PERIODS,
  AGE_THRESHOLDS,
  MINIMUM_DRAWDOWN_RATES,
  INVESTMENT_DEFAULTS,
  RETIREMENT_INCOME,
  getMinimumDrawdownRate,
  getMarginalTaxRate,
  formatPercentage,
  calculateNetReturnRate,
  calculateDailySalary,
  calculatePartTimeRatio,
  calculateLSLSuperContribution
};

export default financialConstants;
