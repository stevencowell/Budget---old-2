# Constants Refactoring Summary

## Overview
This document summarizes the refactoring work to replace hardcoded values across the entire repository with centralized constants. This improves maintainability, reduces errors, and makes it easier to update financial parameters when regulations change.

## Files Created

### 1. `/workspace/client/src/constants/financialConstants.js`
**Purpose:** Central constants file for all React components

**Key Constants Defined:**
- **TAX_RATES**: Super contribution tax (15%), Division 293 threshold ($250,000), marginal tax brackets
- **SUPER_RATES**: Employer guarantee rate (11.5%), common employer contribution rate (11%)
- **CONTRIBUTION_CAPS**: Concessional ($27,500), non-concessional ($110,000), bring-forward ($330,000)
- **TIME_PERIODS**: Working days (260), fortnights (26), months (12), full-time days (5)
- **AGE_THRESHOLDS**: Preservation age (60), pension age (67), retirement ages, life expectancy (90)
- **MINIMUM_DRAWDOWN_RATES**: Age-based minimum withdrawal rates (4%-14%)
- **INVESTMENT_DEFAULTS**: Return rates (7%), inflation (2.5%), admin fees (0.6%)
- **RETIREMENT_INCOME**: 4% rule, withdrawal strategies (3-5%)

**Helper Functions:**
- `getMinimumDrawdownRate(age)` - Returns minimum drawdown rate for age
- `getMarginalTaxRate(income)` - Calculates marginal tax rate
- `formatPercentage(rate)` - Formats decimal to percentage string
- `calculateNetReturnRate(returnRate, adminFees, inflationRate)` - Net return after fees/inflation
- `calculateDailySalary(annualSalary)` - Daily salary based on 260 working days
- `calculatePartTimeRatio(daysPerWeek)` - Part-time ratio calculation
- `calculateLSLSuperContribution(lslDays, annualSalary)` - LSL super contribution

### 2. `/workspace/server/constants/financialConstants.js`
**Purpose:** Central constants file for server-side calculations

**Key Constants Defined:**
- **TAX_RATES**: Super contribution tax (15%)
- **TIME_PERIODS**: Months per year (12), fortnights (26)
- **MINIMUM_DRAWDOWN_RATES**: Age-based minimum withdrawal rates

**Helper Functions:**
- `getMinimumDrawdownPercentage(age)` - Returns minimum drawdown percentage

## Files Modified

### Client Components

#### 1. `/workspace/client/src/components/RetirementPlanner.js`
**Changes:**
- Replaced `7.0` → `INVESTMENT_DEFAULTS.RETURN_RATE`
- Replaced `2.5` → `INVESTMENT_DEFAULTS.INFLATION_RATE`
- Replaced `0.6` → `INVESTMENT_DEFAULTS.ADMIN_FEES`
- Replaced `60` → `AGE_THRESHOLDS.STANDARD_RETIREMENT`
- Replaced `90` → `AGE_THRESHOLDS.DEFAULT_LIFE_EXPECTANCY`
- Replaced `260` → `TIME_PERIODS.WORKING_DAYS_PER_YEAR` (via `calculateDailySalary()`)
- Replaced `26` → `TIME_PERIODS.FORTNIGHTS_PER_YEAR`
- Replaced `5` → `TIME_PERIODS.FULL_TIME_DAYS_PER_WEEK`
- Replaced `0.11` → `SUPER_RATES.EMPLOYER_CONTRIBUTION_RATE` (via `calculateLSLSuperContribution()`)
- Replaced manual calculations with helper functions:
  - `calculateNetReturnRate()` for net return calculations
  - `calculateDailySalary()` for daily salary
  - `calculatePartTimeRatio()` for part-time work calculations
  - `calculateLSLSuperContribution()` for LSL super contributions

#### 2. `/workspace/client/src/components/Dashboard.js`
**Changes:**
- Replaced `$27,500` → `CONTRIBUTION_CAPS.CONCESSIONAL`
- Replaced `$110,000` → `CONTRIBUTION_CAPS.NON_CONCESSIONAL`
- Replaced `60` → `AGE_THRESHOLDS.PRESERVATION_AGE`
- Replaced `11.5%` → `SUPER_RATES.GUARANTEE_PERCENTAGE`
- Replaced `12` → `TIME_PERIODS.MONTHS_PER_YEAR`

#### 3. `/workspace/client/src/components/TaxBenefits.js`
**Changes:**
- Replaced `15%` → `TAX_RATES.SUPER_CONTRIBUTIONS_PERCENTAGE`
- Replaced `$27,500` → `CONTRIBUTION_CAPS.CONCESSIONAL`
- Replaced `$250,000` → `TAX_RATES.DIVISION_293_THRESHOLD`
- Replaced hardcoded `15%` in Division 293 → `TAX_RATES.DIVISION_293_ADDITIONAL_TAX`

#### 4. `/workspace/client/src/components/MinimumDrawdown.js`
**Changes:**
- Replaced `12` → `TIME_PERIODS.MONTHS_PER_YEAR`
- Replaced `26` → `TIME_PERIODS.FORTNIGHTS_PER_YEAR`
- Replaced `60` → `AGE_THRESHOLDS.TAX_FREE_WITHDRAWAL_AGE`
- Replaced hardcoded age brackets with dynamic rendering from `MINIMUM_DRAWDOWN_RATES`

#### 5. `/workspace/client/src/components/RetirementIncome.js`
**Changes:**
- Replaced default `'4'` → `RETIREMENT_INCOME.FOUR_PERCENT_RULE * 100`
- Replaced default `'30'` → `RETIREMENT_INCOME.STANDARD_DURATION_YEARS`
- Replaced `3%`, `4%`, `5%` → `RETIREMENT_INCOME.CONSERVATIVE_RATE`, `MODERATE_RATE`, `AGGRESSIVE_RATE`

#### 6. `/workspace/client/src/components/ProjectionCalculator.js`
**Changes:**
- Replaced default `'7'` → `INVESTMENT_DEFAULTS.RETURN_RATE`

### Server Files

#### 7. `/workspace/server/index.js`
**Changes:**
- Replaced `12` → `TIME_PERIODS.MONTHS_PER_YEAR` (multiple occurrences)
- Replaced `15` → `TAX_RATES.SUPER_CONTRIBUTIONS`
- Replaced hardcoded age bracket logic → `getMinimumDrawdownPercentage()`

### Standalone Files

#### 8. `/workspace/main.js`
**Changes:**
- Added `FINANCIAL_CONSTANTS` object at top of file
- Replaced `0.15` → `FINANCIAL_CONSTANTS.TAX_RATES.SUPER_CONTRIBUTIONS`
- Updated tax tip message to use constant for percentage display

## Benefits of This Refactoring

### 1. **Maintainability**
- Single source of truth for all financial constants
- Easy to update when regulations change (e.g., super guarantee rate increases)
- No need to search through multiple files to update values

### 2. **Consistency**
- Ensures all calculations use the same values
- Reduces risk of copy-paste errors
- Makes it clear when different components should use the same value

### 3. **Documentation**
- Constants file serves as documentation of current rates and thresholds
- Comments explain what each constant represents
- Easy to see which values are current as of 2025

### 4. **Testing**
- Helper functions can be unit tested
- Mock constants for different scenarios
- Easier to test edge cases

### 5. **Extensibility**
- Easy to add new rates (e.g., different investment strategies)
- Helper functions reduce code duplication
- Can easily add validation or range checking

## Example Usage

### Before (Hardcoded):
```javascript
const dailySalary = annualSalary / 260;
const lslSuper = (dailySalary * lslDays) * 0.11;
const netReturn = (returnRate - adminFees) / 100;
```

### After (Using Constants):
```javascript
const dailySalary = calculateDailySalary(annualSalary);
const lslSuper = calculateLSLSuperContribution(lslDays, annualSalary);
const netReturn = calculateNetReturnRate(returnRate, adminFees);
```

## Future Improvements

1. **Add validation functions**: Ensure contributions don't exceed caps
2. **Add year parameter**: Allow constants to vary by financial year
3. **Add regional support**: Different states have different preservation ages
4. **Add inflation adjustment**: Automatically adjust caps for future years
5. **Add unit tests**: Test all helper functions and calculations

## Migration Notes

- All changes are backward compatible
- No changes to API contracts or function signatures
- Constants can be easily overridden for testing
- Helper functions can be used alongside direct constant access

## Constants Location Reference

| Component | Constants File Location |
|-----------|------------------------|
| React Components | `/workspace/client/src/constants/financialConstants.js` |
| Server API | `/workspace/server/constants/financialConstants.js` |
| Budget App (main.js) | Defined inline at top of `/workspace/main.js` |

## Verification

All files have been checked and show no linter errors. The refactoring maintains all existing functionality while improving code quality and maintainability.

---

**Date:** October 2, 2025  
**Scope:** Repository-wide constants refactoring  
**Impact:** All components using financial calculations
