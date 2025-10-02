# Budget Total Calculation Fix

## Issue Identified

The budget totals were extremely high ($529,214.00) because the calculation was incorrectly including summary rows in the total.

### Root Cause

The `budget_summary` data in `financial_overview.json` includes two special summary rows:
1. **"Total" row** - Contains a subtotal value of $169,270.00 for Miscellaneous Expenses
2. **"Cash Flow" row** - Contains a cash flow value of $10,702.00

These rows were being treated as regular budget line items and summed along with all the actual budget items, resulting in double-counting.

### Calculation Error

**Before Fix:**
- All individual budget items: $349,242.00
- Plus "Total" summary row: $169,270.00
- Plus "Cash Flow" summary row: $10,702.00
- **Incorrect Total: $529,214.00** ❌

**After Fix:**
- All individual budget items only: $349,242.00
- **Correct Total: $349,242.00** ✅

## Solution Implemented

### Changes Made to `/workspace/Budget-main/scripts/generate_data.py`

#### Filter Summary Rows at Data Generation (Line 105-107)
```python
# Skip summary rows (Total, Cash Flow) to prevent double-counting
if name in ("Total", "Cash Flow"):
    continue
```

This prevents the summary rows from being loaded into the budget_items array when the Excel file is parsed. This is the **primary fix** at the data source level.

### Changes Made to `/workspace/main.js`

#### 1. Filter Summary Rows at Initialization (Line 891-892)
```javascript
// Filter out summary rows (Total, Cash Flow) from the budget items
const filteredItems = (savedItems || items).filter(item => item.item !== 'Total' && item.item !== 'Cash Flow');
```

This prevents the summary rows from ever being added to the budget table's state.

#### 2. Safety Check in Total Calculation (Line 905-908)
```javascript
// Exclude summary rows from totals calculation
if (item.item === 'Total' || item.item === 'Cash Flow') {
  return;
}
```

This provides an additional safety check in case summary rows somehow make it into the items array.

## Budget Line Items Summary

The corrected budget includes 30 line items:

**Income:**
- Income: $179,972

**Housing & Utilities:**
- Water: $1,500
- Gas/Electricity: $5,700
- Internet/Phone/Pay TV: $6,500
- Rates: $2,600

**Groceries & Dining:**
- Groceries: $15,600
- Butchers: $3,000
- Restaurants: $6,000

**Transportation:**
- Fuel: $4,000
- Tuscon Car/Anne: $2,000
- Colorado Ute/Steve: $2,000
- Mazda Ute/James: $2,000
- Honda Car/Lily: $2,000

**Health & Insurance:**
- BT Life Insurance: $9,000
- Pharmacy: $2,000
- House and Content - WFI: $7,200
- Doctors/Dentist/Physio: $2,000

**Entertainment & Recreation:**
- Ballet/Sport: $1,500
- Ski Boat and Trailer: $400
- Fishing Boat and Trailer: $300
- Pool: $500

**Savings & Investments:**
- Investment Air BnB: $52,000

**Miscellaneous Expenses:**
- ATM Cash Withdrawals: $15,000
- VET/Dog Food: $800
- Birthdays: $2,500
- Clothes: $10,000
- Christmas: $2,500
- Other Incidentals/Bunnings etc: $3,000
- Pocket Money: $1,170
- TRAC school fees: $6,500

**Total Annual Budget: $349,242.00**

## Testing

To verify the fix:
1. Open the Budget Manager view
2. Check the "Annual budget" total at the bottom of the table
3. Verify it shows approximately $349,242.00 (excluding the "Total" and "Cash Flow" rows)
4. The "Total" and "Cash Flow" rows should no longer appear in the budget table

## Additional Notes

- **Two-level fix**: The summary rows are now filtered out at both the data generation level (Python script) and the display level (JavaScript)
- This ensures that future data regenerations won't include these problematic rows
- Existing data in `financial_overview.json` is protected by the JavaScript filter until the data is regenerated
- The fix is backward compatible with saved budget items in localStorage
- If you regenerate the data by running `generate_data.py`, the new JSON file will not contain "Total" or "Cash Flow" rows
