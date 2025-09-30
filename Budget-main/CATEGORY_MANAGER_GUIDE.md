# Category Manager - User Guide

## Overview

The new **Category Manager** view provides comprehensive tools to organize, analyze, and manage your expense categories with complete transparency about where your money is going.

## Features

### 1. Complete Category Breakdown

The Category Manager displays all your expenses organized by category and subcategory with:
- **Income** and **Expense** totals for each category
- **Net position** calculations
- **Percentage of total spending** for each category
- **Transaction counts** to see volume in each category

### 2. Filtering Options

Filter your view by:
- **Specific category**: Focus on one category at a time
- **Transaction type**: View only income or expenses
- **Time period**: All time, this month, this quarter, or this year

### 3. Category Summary Cards

Visual cards show your top 8 spending categories at a glance:
- Click any card to drill down into that category
- See total spent and percentage of overall spending
- Quick access to detailed transaction lists

### 4. Moving Expenses Between Categories

You can easily recategorize transactions in two ways:

#### Single Transaction Move
1. Click "View" on any category in the breakdown table
2. Find the transaction you want to move
3. Click "Move" on that transaction
4. Enter the new category and subcategory

#### Bulk Move
1. Click "View" on a category to see all transactions
2. Check the boxes next to transactions you want to move
3. Select the destination category from the dropdown
4. Select the destination subcategory
5. Click "Apply" to move all selected transactions

All category changes are **automatically saved** to your browser's local storage and persist across sessions.

### 5. Upload Monthly Statements

Upload CSV bank statements directly:
1. Click "📤 Upload Statement" button
2. Select your CSV file (same format as your existing statements)
3. Transactions are **automatically categorized** using smart rules:
   - Groceries (Woolworths, Coles, etc.)
   - Fuel (BP, Mobil, Caltex, etc.)
   - Utilities (Telstra, Origin Energy, etc.)
   - Salary and income sources
   - And many more...

Newly uploaded transactions are added to your data and integrated into all views.

### 6. Export Category Data

Export your complete category breakdown:
- Click "Export Categories" to download a JSON file
- Includes all category aggregations
- Contains your custom category changes
- Useful for record-keeping or sharing with accountants

## How Auto-Categorization Works

When you upload a CSV statement, the system analyzes each transaction description and automatically assigns it to the most appropriate category using keyword matching:

**Example Rules:**
- "WOOLWORTHS" → Groceries & Dining > Groceries
- "BP BOOROOMA" → Transportation > Fuel
- "TELSTRA" → Housing & Utilities > Telecom - Home
- "NSW GOVT SCHOOLS PAYRO" → Income > Salary

You can always manually recategorize any transaction if the automatic assignment isn't quite right.

## Data Persistence

All your category changes are stored locally in your browser using localStorage with the key `cowell_budget_category_changes`. This means:
- ✅ Changes persist even if you reload the page
- ✅ No server required - all processing happens in your browser
- ✅ Privacy preserved - your data never leaves your device
- ⚠️ Changes are browser-specific (won't sync across devices)
- ⚠️ Clearing browser data will reset your changes

## Tips for Best Results

1. **Review Auto-Categorization**: After uploading statements, review the automatic categorization and adjust as needed
2. **Use Bulk Move**: Select multiple similar transactions at once to save time
3. **Filter by Period**: Use "This Month" or "This Quarter" to focus on recent spending patterns
4. **Export Regularly**: Download your category breakdowns periodically for records
5. **Consistent Categories**: Try to use the same category names to maintain consistency

## Technical Notes

### CSV Format Expected
The upload feature expects CSV files in this format:
```
Date,Posted Date,Description,Category,Amount,Balance
30 SEP 2024,,"WOOLWORTHS WAGGA WAGGA",,-123.45,1000.00
```

The system uses columns:
- Column 0: Transaction date
- Column 2: Description
- Column 4: Amount (negative for expenses)
- Column 5: Balance (optional)

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Uses HTML5 File API for uploads
- Uses localStorage for persistence

## Troubleshooting

**Q: My uploaded transactions aren't showing up**
- Check that your CSV file follows the expected format
- Make sure the file has actual transaction data (not just headers)
- Try refreshing the page and re-uploading

**Q: Category changes aren't saving**
- Check that your browser allows localStorage
- Make sure you're not in private/incognito mode
- Try exporting your changes as a backup

**Q: Auto-categorization isn't working well**
- This is expected for unique merchants
- Simply use the Move function to recategorize
- The system learns from common patterns, not from your changes

**Q: Can I undo a category change?**
- Currently, you need to manually move transactions back
- Consider exporting your data before making bulk changes
- Future versions may include an undo feature

## Future Enhancements

Potential future features:
- Machine learning-based categorization that learns from your corrections
- Category rules editor to customize auto-categorization
- Drag-and-drop interface for moving transactions
- Category spending trends over time
- Budget alerts per category
- Multi-device sync via cloud storage