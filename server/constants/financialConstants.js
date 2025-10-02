/**
 * Financial Constants for Superannuation and Retirement Planning (Server-side)
 * 
 * This file contains all hardcoded financial values, rates, and limits
 * used throughout the server application. Values are current as of 2025.
 */

// === TAX RATES ===
const TAX_RATES = {
  // Superannuation contribution tax rate
  SUPER_CONTRIBUTIONS: 15, // 15%
  SUPER_CONTRIBUTIONS_DECIMAL: 0.15,
  
  // Division 293 tax threshold
  DIVISION_293_THRESHOLD: 250000,
  DIVISION_293_ADDITIONAL_TAX: 15, // Additional 15%
  
  // Medicare levy
  MEDICARE_LEVY: 2, // 2%
};

// === TIME PERIODS ===
const TIME_PERIODS = {
  MONTHS_PER_YEAR: 12,
  FORTNIGHTS_PER_YEAR: 26,
  WEEKS_PER_YEAR: 52,
};

// === MINIMUM DRAWDOWN RATES ===
// Minimum pension withdrawal rates by age (account-based pensions)
const MINIMUM_DRAWDOWN_RATES = [
  { minAge: 0, maxAge: 64, percentage: 4 },
  { minAge: 65, maxAge: 74, percentage: 5 },
  { minAge: 75, maxAge: 79, percentage: 6 },
  { minAge: 80, maxAge: 84, percentage: 7 },
  { minAge: 85, maxAge: 89, percentage: 9 },
  { minAge: 90, maxAge: 94, percentage: 11 },
  { minAge: 95, maxAge: Infinity, percentage: 14 }
];

/**
 * Get the minimum drawdown percentage for a given age
 * @param {number} age - The person's age
 * @returns {number} Minimum drawdown percentage
 */
const getMinimumDrawdownPercentage = (age) => {
  const bracket = MINIMUM_DRAWDOWN_RATES.find(
    (bracket) => age >= bracket.minAge && age <= bracket.maxAge
  );
  return bracket ? bracket.percentage : MINIMUM_DRAWDOWN_RATES[MINIMUM_DRAWDOWN_RATES.length - 1].percentage;
};

module.exports = {
  TAX_RATES,
  TIME_PERIODS,
  MINIMUM_DRAWDOWN_RATES,
  getMinimumDrawdownPercentage
};
