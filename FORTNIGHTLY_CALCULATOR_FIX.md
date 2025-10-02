# Fortnightly Lifestyle Tuner - Calculation Fix

## Issue Identified

The "Essential Commitments" calculation was incorrectly including **Airbnb investment property expenses** (loan payments, utilities, maintenance, etc.), inflating the amount from ~$66K to ~$205K annually.

### Before Fix:
- **Essential commitments**: $7,876.96/fortnight ($204,801/year)
  - Included $138,887 in Airbnb property expenses
  - Included $131,175 in Airbnb loan payments alone
- **Flexible lifestyle**: $3,574.08/fortnight
- **Total needed**: $11,451/fortnight
- **Shortfall**: -$4,529/fortnight (vs $6,922 income)

This made it appear you were spending almost $300K annually on personal expenses, which exceeded your total income.

## Root Cause

The `ESSENTIAL_SUBCATEGORIES` set in `/workspace/Budget-main/scripts/generate_data.py` (lines 232-252) included:
- `"Airbnb Loan Payment"`
- `"Airbnb Utilities"`
- `"Airbnb Rates"`
- `"Airbnb Cleaning"`
- `"Airbnb Maintenance"`

Additionally, the `essential_spending()` function calculated discretionary spending as:
```python
discretionary = total_expense - essential_total
```

This meant Airbnb expenses were being counted in discretionary spending even after being removed from essentials.

## Fix Applied

### 1. Removed Airbnb expenses from essential subcategories
Excluded all Airbnb-related subcategories from the essential spending calculation, treating the Airbnb property as a separate investment business.

### 2. Corrected discretionary calculation
Modified the `essential_spending()` function to:
```python
# Track Airbnb expenses separately
airbnb_expenses = sum of all "Airbnb Property" category expenses
personal_expenses = total_expense - airbnb_expenses
discretionary = personal_expenses - essential_total
```

## After Fix:

### Personal Expenses (Fortnightly):
- **Fortnightly income**: $6,922.00
- **Essential commitments**: $2,535.14/fortnight ($65,914/year)
  - Utilities (water, electricity, telecom, rates)
  - Insurance (home, health, income protection)
  - Groceries, butcher, fuel
  - Vehicle costs, education fees
  - Healthcare, pharmacy
- **Flexible lifestyle**: $3,574.08/fortnight ($92,926/year)
  - Dining, shopping, entertainment
  - Subscriptions, retail purchases
  - Uncategorized expenses
- **Total needed**: $6,109.22/fortnight
- **✅ Surplus**: **$812.78/fortnight** ($21,132/year)

### Airbnb Property (Investment - Tracked Separately):
- **Income**: $25,612.49/year
- **Expenses**: $138,887.31/year
  - Loan payments: $131,175.10
  - Utilities: $4,450.71
  - Cleaning: $2,981.00
  - Maintenance: $265.00
  - Rates: $15.50
- **Net**: -$113,274.82/year

## What Changed in the Data

### File: `/workspace/Budget-main/scripts/generate_data.py`

**Lines 232-253**: Commented out Airbnb subcategories from `ESSENTIAL_SUBCATEGORIES`

**Lines 753-777**: Updated `essential_spending()` function to:
1. Calculate Airbnb expenses separately
2. Subtract Airbnb expenses from total expenses to get personal expenses
3. Calculate discretionary as: `personal_expenses - essential_total`

### Generated Data: `/workspace/data/financial_overview.json`

**Metrics section** now shows:
```json
"essential_annual": 65913.77,
"discretionary_annual": 92925.97
```

**calc_defaults section** now shows:
```json
"essential_fortnight": 2535.14,
"discretionary_fortnight": 3574.08
```

## Result

The fortnightly lifestyle tuner now accurately reflects your **personal** spending needs, showing:
- You have a **$812.78 fortnightly surplus** for savings/investments
- The Airbnb property is tracked separately as an investment property
- Essential and discretionary spending totals are realistic ($159K vs $298K previously)

The app will now display the corrected values when viewing the Financial Planning Studio.
