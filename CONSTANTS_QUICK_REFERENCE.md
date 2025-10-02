# Financial Constants Quick Reference

## How to Use Constants in Your Code

### For React Components

Import the constants at the top of your file:

```javascript
import {
  TAX_RATES,
  SUPER_RATES,
  CONTRIBUTION_CAPS,
  TIME_PERIODS,
  AGE_THRESHOLDS,
  INVESTMENT_DEFAULTS,
  RETIREMENT_INCOME,
  calculateDailySalary,
  calculatePartTimeRatio,
  // ... other helper functions
} from '../constants/financialConstants';
```

### For Server-Side Code

```javascript
const {
  TAX_RATES,
  TIME_PERIODS,
  getMinimumDrawdownPercentage
} = require('./constants/financialConstants');
```

## Common Constants Cheat Sheet

### Tax & Super Rates
```javascript
TAX_RATES.SUPER_CONTRIBUTIONS           // 0.15 (decimal) or
TAX_RATES.SUPER_CONTRIBUTIONS_PERCENTAGE // 15 (percentage)
TAX_RATES.DIVISION_293_THRESHOLD        // 250000 ($250,000)
SUPER_RATES.EMPLOYER_CONTRIBUTION_RATE  // 0.11 (11%)
SUPER_RATES.GUARANTEE_PERCENTAGE        // 11.5 (11.5%)
```

### Contribution Caps
```javascript
CONTRIBUTION_CAPS.CONCESSIONAL      // 27500 ($27,500/year)
CONTRIBUTION_CAPS.NON_CONCESSIONAL  // 110000 ($110,000/year)
```

### Time Periods
```javascript
TIME_PERIODS.WORKING_DAYS_PER_YEAR      // 260
TIME_PERIODS.FORTNIGHTS_PER_YEAR        // 26
TIME_PERIODS.MONTHS_PER_YEAR            // 12
TIME_PERIODS.FULL_TIME_DAYS_PER_WEEK    // 5
```

### Ages & Life Expectancy
```javascript
AGE_THRESHOLDS.PRESERVATION_AGE         // 60
AGE_THRESHOLDS.STANDARD_RETIREMENT      // 60
AGE_THRESHOLDS.TAX_FREE_WITHDRAWAL_AGE  // 60
AGE_THRESHOLDS.DEFAULT_LIFE_EXPECTANCY  // 90
```

### Investment Defaults
```javascript
INVESTMENT_DEFAULTS.RETURN_RATE         // 7.0 (%)
INVESTMENT_DEFAULTS.INFLATION_RATE      // 2.5 (%)
INVESTMENT_DEFAULTS.ADMIN_FEES          // 0.6 (%)
```

### Retirement Income Rules
```javascript
RETIREMENT_INCOME.FOUR_PERCENT_RULE     // 0.04
RETIREMENT_INCOME.CONSERVATIVE_RATE     // 0.03
RETIREMENT_INCOME.MODERATE_RATE         // 0.04
RETIREMENT_INCOME.AGGRESSIVE_RATE       // 0.05
```

## Helper Functions

### Calculate Daily Salary
```javascript
const dailySalary = calculateDailySalary(annualSalary);
// Returns: annualSalary / 260
```

### Calculate Part-Time Ratio
```javascript
const ratio = calculatePartTimeRatio(daysPerWeek);
// Returns: daysPerWeek / 5
// Example: 4 days/week = 0.8 (80%)
```

### Calculate LSL Super Contribution
```javascript
const lslSuper = calculateLSLSuperContribution(lslDays, annualSalary);
// Returns: (annualSalary / 260) * lslDays * 0.11
```

### Calculate Net Return Rate
```javascript
const netRate = calculateNetReturnRate(returnRate, adminFees);
// Returns: (returnRate - adminFees) / 100

const realReturn = calculateNetReturnRate(returnRate, adminFees, inflationRate);
// Returns: (returnRate - adminFees - inflationRate) / 100
```

### Get Minimum Drawdown Rate
```javascript
const drawdown = getMinimumDrawdownRate(age);
// Returns: { rate: 0.04, percentage: 4 }
```

### Get Marginal Tax Rate
```javascript
const taxRate = getMarginalTaxRate(income);
// Returns: decimal tax rate (e.g., 0.37 for 37%)
```

## Common Calculations Examples

### Calculate Fortnightly to Annual Contribution
```javascript
const annualContribution = fortnightlyAmount * TIME_PERIODS.FORTNIGHTS_PER_YEAR;
```

### Calculate Monthly Income from Annual
```javascript
const monthlyIncome = annualIncome / TIME_PERIODS.MONTHS_PER_YEAR;
```

### Check if Part-Time
```javascript
if (daysPerWeek < TIME_PERIODS.FULL_TIME_DAYS_PER_WEEK) {
  // Part-time logic
}
```

### Calculate Tax Savings from Super Contributions
```javascript
const taxSaved = contribution * (marginalRate / 100 - TAX_RATES.SUPER_CONTRIBUTIONS);
```

### Display Tax Rate
```javascript
<p>Super contributions are taxed at {TAX_RATES.SUPER_CONTRIBUTIONS_PERCENTAGE}%</p>
```

## Minimum Drawdown Rates by Age

| Age Range | Rate |
|-----------|------|
| Under 65  | 4%   |
| 65-74     | 5%   |
| 75-79     | 6%   |
| 80-84     | 7%   |
| 85-89     | 9%   |
| 90-94     | 11%  |
| 95+       | 14%  |

Access programmatically:
```javascript
const { percentage } = getMinimumDrawdownRate(age);
```

## When to Update Constants

Constants should be updated when:
1. **Government changes contribution caps** (usually July 1st)
2. **Super guarantee rate changes** (scheduled increases)
3. **Tax brackets are adjusted** (annual indexation)
4. **Minimum drawdown rates change** (temporarily reduced during COVID)

## File Locations

- **Client constants:** `/workspace/client/src/constants/financialConstants.js`
- **Server constants:** `/workspace/server/constants/financialConstants.js`
- **Budget app:** Inline at top of `/workspace/main.js`

---

**Pro Tip:** Always use constants instead of hardcoded values. If you need a new constant, add it to the appropriate constants file rather than hardcoding it.
