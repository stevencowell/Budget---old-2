# Transaction Filtering Guide

## Overview
The Cowell Family Budget Command Centre now includes **1,522 transactions** spanning 13 months (September 2024 - September 2025) from both statement files. This guide shows you how to use the powerful filtering features.

**NEW**: Overview tab now includes date filtering! See the [Overview Date Filtering](#overview-date-filtering) section below.

---

## Overview Date Filtering

**Location:** Overview tab (first card at the top)

### Available Filters

#### Period Filter
- **All Time** - All 13 months of data (default)
- **Last 12 Months** - Rolling 12-month period from today
- **Last 6 Months** - Rolling 6-month period
- **Last 3 Months** - Rolling 3-month period (quarterly view)
- **Year to Date** - January 1st of current year to present
- **Custom Date Range** - Select specific start and end months

### What Gets Filtered
When you apply a date filter, ALL overview components update:
- Financial snapshot cards (income, expenses, net position)
- Financial trends chart
- Category distribution pie chart
- Category breakdown bars
- Top spending partners list
- Reliable income sources list

### How to Use
1. Go to Overview tab
2. Use the "Period" dropdown to select your desired time range
3. For custom ranges, select "Custom Date Range" and set From/To months
4. Click "Clear Filters" to reset to "All Time"

### Example Use Cases
- **Monthly review**: Select "Last 3 Months"
- **Tax preparation**: Use Custom Range for financial year (e.g., July 2024 - June 2025)
- **Quarterly planning**: Select "Last 3 Months" or use Custom Range
- **Annual budget**: Select "Year to Date"

For detailed information, see [OVERVIEW_FILTERING_FEATURE.md](OVERVIEW_FILTERING_FEATURE.md).

---

## Transaction Explorer

**Location:** Click "Transactions" tab in the navigation menu

### Available Filters

#### 1. **Search Box** (Text Search)
- Search across transaction descriptions
- Case-insensitive
- Real-time filtering as you type
- **Example searches:**
  - `woolworths` - Find all Woolworths transactions
  - `hotel` - Find all hotel/dining transactions
  - `airbnb` - Find Airbnb-related transactions

#### 2. **Category Filter**
Filter by any of the 15 categories:
- Airbnb Property
- Cash & Card
- Entertainment & Recreation
- Financial
- Groceries & Dining
- Health & Insurance
- Home & Garden
- Housing & Utilities
- Income
- Kids & Education
- Lifestyle & Shopping
- Professional
- Transfers
- Transportation
- Uncategorized

#### 3. **Type Filter**
- **All types** - Show everything
- **Income** - Only show income transactions
- **Expense** - Only show expense transactions

#### 4. **Date Range Filters**
- **Date From:** Set start date for filter
- **Date To:** Set end date for filter
- Leave blank to not filter by date
- **Example:** Set "Date From: 2025-07-01" to see only transactions from July 2025 onwards

### Filter Examples

**Example 1: Find all Groceries in August 2025**
1. Category: "Groceries & Dining"
2. Date From: "2025-08-01"
3. Date To: "2025-08-31"

**Example 2: Search for Airbnb loan payments**
1. Search: "9351515L84"
2. Type: "Expense"

**Example 3: View all income transactions**
1. Type: "Income"
2. Category: "Income"

### Features
- **Pagination:** 50 transactions per page
- **Transaction Count:** Shows number of matching transactions
- **Total Amount:** Shows sum of filtered transactions
- **Edit:** Click "Edit" to modify transaction amounts
- **Delete:** Click "Delete" to remove transactions from view
- **Clear Filters:** Click "Clear Filters" button to reset all filters

---

## Category Manager

**Location:** Click "Category Manager" tab in the navigation menu

### Available Filters

#### 1. **Category Filter**
Select any category to view only that category's transactions and statistics.

#### 2. **Type Filter**
- **All Types** - Income and expense transactions
- **Income** - Only income transactions  
- **Expense** - Only expense transactions

#### 3. **Period Filter**
- **All Time** - All 1,522 transactions (13 months)
- **This Month** - Current month only
- **This Quarter** - Current quarter (3 months)
- **This Year** - Current year (January to September 2025)

### Features

#### Summary Cards
- Top 8 spending categories displayed as cards
- Shows total amount, transaction count, and percentage of total spending
- Click any card to view detailed transactions

#### Category Breakdown Table
- All categories with subcategories
- Shows:
  - Income amounts
  - Expense amounts
  - Net position (income - expenses)
  - Percentage of total spending
  - Transaction count
- Click "View" to see transaction details

#### Category Details Panel
When viewing a specific category:
- **Statistics:** Total income, expenses, net position, transaction count
- **Transaction List:** All transactions in that category
- **Bulk Actions:**
  - Select multiple transactions with checkboxes
  - Move selected transactions to different category/subcategory
- **Individual Actions:**
  - Move single transaction to new category

### Filter Examples

**Example 1: Review Groceries spending this month**
1. Category Filter: "Groceries & Dining"
2. Type Filter: "Expense"
3. Period Filter: "This Month"

**Example 2: Check all Airbnb income and expenses**
1. Category Filter: "Airbnb Property"
2. Type Filter: "All Types"
3. Period Filter: "All Time"

**Example 3: Analyze transportation costs this quarter**
1. Category Filter: "Transportation"
2. Type Filter: "Expense"
3. Period Filter: "This Quarter"

---

## Monthly Statements

**Location:** Click "Monthly Statements" tab in the navigation menu

### Features

#### Month Selector
- Dropdown menu with all 13 months
- Select any month to view detailed analysis
- Default: Most recent month

#### Monthly Analysis
For each selected month, view:
- **Summary Statistics:**
  - Income total
  - Expense total
  - Net position
  - Savings rate
- **Comparisons:** Month-over-month changes
- **Category Breakdown:** Pie chart of spending by category
- **Key Insights:** Automated insights and recommendations

#### Cashflow Table
- View all 13 months at a glance
- Shows income, expenses, net, and savings rate for each month
- Click "View Details" to jump to that month's analysis

---

## Tips for Effective Filtering

### Finding Specific Merchants
Use the search box in Transaction Explorer:
```
estella    → Find all Estella Foodworks transactions
telstra    → Find all Telstra bills
origin     → Find all Origin Energy bills
```

### Analyzing Spending Patterns
1. Go to Category Manager
2. Set Period Filter to "This Month"
3. Review category breakdown to identify trends
4. Click on high-spending categories to drill down

### Preparing Tax Documentation
1. Transaction Explorer → Type Filter: "Income"
2. Date Range: Set to financial year dates (e.g., 2024-07-01 to 2025-06-30)
3. Review and export income transactions

### Reviewing Recurring Expenses
1. Category Manager → Select specific category (e.g., "Housing & Utilities")
2. Period Filter: "All Time"
3. View detailed transactions to identify all recurring bills

### Budget Tracking
1. Monthly Statements → Select current month
2. Review savings rate and net position
3. Compare with previous months to track progress
4. Use insights to identify areas for improvement

---

## Data Export

### Export Options

#### Transaction Data
- **Location:** Transaction Explorer
- **Method:** Currently client-side only (can be added)
- **Contains:** All filtered transactions

#### Category Analysis
- **Location:** Category Manager  
- **Button:** "Export Categories"
- **Format:** JSON file
- **Contains:** 
  - Category summaries
  - All transactions
  - Custom category changes
  - Export date

#### Budget Data
- **Location:** Budget Manager  
- **Button:** "Export Data"
- **Format:** JSON file
- **Contains:**
  - Budget items with actuals
  - Saved scenarios
  - Export date

---

## Performance Notes

### Fast Filtering
- All 1,522 transactions load at page startup
- Filtering happens instantly in your browser
- No server requests needed for filtering
- Smooth pagination through all pages

### Browser Compatibility
Tested and working on:
- Chrome/Edge (recommended)
- Firefox
- Safari

### Data Refresh
To load new transactions:
1. Add new CSV data to the repository
2. Run `python3 scripts/generate_data.py`
3. Refresh the browser page

---

## Troubleshooting

### No transactions showing
- Check if filters are too restrictive
- Click "Clear Filters" button
- Refresh the page

### Search not finding expected results
- Check spelling (search is case-insensitive but must match text)
- Try shorter search terms (e.g., "wool" instead of "woolworths online")
- Clear other filters that might exclude results

### Date filters not working
- Ensure date format is YYYY-MM-DD
- Check that "Date From" is before "Date To"
- Clear date filters and try again

### Category changes not saving
- Category changes are saved to browser localStorage
- Use "Export Categories" to save a backup
- Changes persist across browser sessions (same browser only)

---

## Summary

The filtering system provides powerful tools to analyze your **1,522 transactions** across **13 months** of financial history. Use the Transaction Explorer for detailed searches, Category Manager for spending analysis, and Monthly Statements for time-based insights.

**Quick Access:**
- Search transactions: Transaction Explorer → Search box
- Analyze spending: Category Manager → Period filter
- Compare months: Monthly Statements → Month selector
- Filter dates: Any view → Date range filters