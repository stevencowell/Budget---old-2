# User Guide: Cowell Family Budget Command Centre

## Quick Start

1. **Start the application**:
   ```bash
   ./start_server.sh
   ```
   Or manually:
   ```bash
   python3 scripts/generate_data.py
   python3 -m http.server 8000
   ```

2. **Open in browser**: Navigate to `http://localhost:8000/web/`

3. **Navigate**: Use the top navigation bar to switch between views

## Views Overview

### 📊 Overview
Your financial dashboard at a glance.

**What you'll see:**
- Total income, expenses, and net position (12 months)
- Monthly trend charts showing cashflow patterns
- Category spending distribution
- Airbnb property performance
- Top merchants and income sources

**Actions:**
- Toggle chart data series on/off
- Explore category breakdowns
- Review top spending patterns

---

### 💰 Budget Manager
Create, edit, and track your budget.

**Features:**
- View all budget items with actual vs planned comparison
- See variance (over/under budget) for each category
- Track percentage of budget used
- Visual progress chart comparing budgeted vs actual

**How to use:**

**Add a new budget item:**
1. Click "+ Add Budget Item"
2. Enter category (e.g., "Housing & Utilities")
3. Enter item name (e.g., "Water")
4. Enter annual budget amount
5. Item appears in table immediately

**Edit an existing item:**
1. Click "Edit" in the Actions column
2. Update annual budget amount
3. Update actual 12-month spend (if needed)
4. Changes apply immediately

**Duplicate an item:**
- Click "Duplicate" to create a copy
- Useful for similar categories (e.g., different vehicles)

**Save your budget:**
1. Make all desired changes
2. Click "Save Budget"
3. Data persists in browser storage
4. Survives page refreshes

**Reset to defaults:**
- Click "Reset to Defaults" to discard all changes
- Returns to original budget from Excel file

**Export/Import:**
- Click "Export Data" to download JSON backup
- Click "Import Data" to restore from backup
- Includes budget and scenario data

---

### 📅 Monthly Statements
Detailed analysis of each month's financial activity.

**Features:**
- Month selector with all available months
- Income, expenses, net position, and savings rate
- Month-over-month change indicators
- Category breakdown pie chart
- AI-powered insights and recommendations

**How to use:**

**View a specific month:**
1. Select month from dropdown
2. Summary stats update automatically
3. Chart shows category distribution
4. Insights section highlights opportunities

**Understanding insights:**
- ✅ Green checkmarks = positive achievements
- ⚠️ Warning signs = areas needing attention
- 💡 Light bulbs = suggestions for improvement
- 📊 Charts = data-driven observations

**Compare months:**
- Look at "vs last month" indicators
- Track savings rate trends
- Identify spending spikes
- Monitor category changes

**Cashflow table:**
- Shows all months in one view
- Click "View Details" to jump to that month's statement
- Savings rate calculated for each month
- Color-coded net position (green = positive, orange = negative)

---

### 🎯 Financial Planning Studio
Advanced calculators for financial planning.

#### **Fortnightly Lifestyle Tuner**
Model your fortnightly budget to optimize savings.

**Inputs:**
- Fortnightly after-tax income
- Essential commitments (bills, groceries, etc.)
- Flexible lifestyle spend (dining, entertainment)

**Output:**
- Available surplus for savings/debt repayment
- Annual potential savings
- Warnings if expenses exceed income

**Use case:** Adjust spending categories to see how much you can save each fortnight.

---

#### **Savings Goal Mapper**
Calculate how long it takes to reach a savings goal.

**Inputs:**
- Goal amount (target savings)
- Current savings balance
- Monthly contribution
- Interest rate (annual %)

**Output:**
- Time to reach goal (years and months)
- Target completion date
- Total contributions vs interest earned
- Compound growth visualization

**Use case:** Planning for vacation, emergency fund, house deposit, or major purchase.

---

#### **Debt Payoff Accelerator**
See the impact of extra debt payments.

**Inputs:**
- Current loan balance
- Interest rate (annual %)
- Minimum monthly payment
- Extra monthly payment amount

**Output:**
- Payoff timeline without extra payments
- Payoff timeline with extra payments
- Total interest saved
- Months saved

**Use case:** Decide if extra mortgage payments are worth it, or how fast you can clear credit card debt.

---

#### **Airbnb Safety Buffer**
Stress test your rental property finances.

**Inputs:**
- Slider to adjust income drop percentage (0-50%)

**Output:**
- New net position with reduced income
- Required emergency buffer
- Monthly shortfall (if any)
- Recommendations for reserves

**Use case:** Plan for vacancy periods, market downturns, or unexpected expenses.

---

#### **Retirement Projection**
Estimate your retirement savings with compound growth.

**Inputs:**
- Current retirement balance
- Monthly contribution
- Years until retirement
- Expected annual return (%)

**Output:**
- Projected retirement balance
- Total contributions
- Investment growth
- Annual retirement income (4% rule)

**Use case:** Long-term retirement planning, superannuation projections.

---

#### **What-If Scenario Modeler**
Compare different financial scenarios side-by-side.

**How to use:**
1. Enter scenario name (e.g., "New Car Purchase")
2. Enter monthly cost change (negative for expenses)
3. Enter duration in months
4. Click "Add Scenario"

**Output:**
- New monthly surplus calculation
- Total financial impact
- All scenarios saved and displayed
- Persistent across sessions

**Example scenarios:**
- New car payment: -$500/month for 60 months
- Salary increase: +$1,000/month ongoing
- Childcare ending: +$2,000/month from specific date
- New subscription: -$50/month ongoing

**Delete scenarios:**
- Click × button on any scenario card
- Immediately recalculates impacts

---

### 🔍 Transaction Explorer
Search, filter, and manage your transactions.

**Features:**
- Full-text search across descriptions
- Filter by category and transaction type
- Date range filtering
- Pagination for large datasets
- Real-time statistics

**How to use:**

**Search transactions:**
1. Type merchant name or description in search box
2. Results filter in real-time
3. Shows count and total of filtered transactions

**Filter by category:**
- Select category from dropdown
- Only transactions in that category show
- Combine with other filters

**Filter by type:**
- Choose "Income" or "Expense"
- Useful for reviewing spending separately from income

**Filter by date:**
1. Set "From" date
2. Set "To" date
3. Only transactions in range display

**Clear all filters:**
- Click "Clear Filters" button
- Resets to showing all transactions

**Edit a transaction:**
1. Click "Edit" in Actions column
2. Enter new amount (use negative for expenses)
3. Useful for corrections or adjustments

**Delete a transaction:**
1. Click "Delete" in Actions column
2. Confirm deletion
3. Transaction removed from view only (not from source data)

**Pagination:**
- Shows 50 transactions per page
- Use "Previous" and "Next" buttons to navigate
- Page indicator shows current position

---

## Tips & Best Practices

### Budget Management
1. **Start conservative**: Better to underestimate income and overestimate expenses
2. **Review monthly**: Update actuals and adjust budget categories
3. **Use categories**: Break down big categories into specific items
4. **Track variance**: Pay attention to items consistently over/under budget
5. **Save regularly**: Export your budget data monthly as backup

### Monthly Analysis
1. **Review insights**: The AI-generated insights often spot patterns you miss
2. **Compare trends**: Look at 3-6 months of data to see real patterns
3. **Target 20% savings rate**: This is a healthy benchmark for most families
4. **Investigate spikes**: Unusual months often reveal one-off expenses

### Financial Planning
1. **Model before acting**: Use calculators before making major decisions
2. **Be realistic**: Use conservative estimates for income, pessimistic for expenses
3. **Factor in inflation**: Add 2-3% to future expense estimates
4. **Emergency fund first**: Aim for 6 months expenses before investing
5. **Debt vs savings**: Generally pay off high-interest debt before saving

### Transaction Management
1. **Regular reviews**: Check transactions weekly to catch errors early
2. **Categorize accurately**: Proper categories make reports meaningful
3. **Search by merchant**: Find all transactions from specific vendors
4. **Use date ranges**: Compare spending in different periods
5. **Clean anomalies**: Edit or delete clearly wrong transactions

### Data Management
1. **Update regularly**: Download new transactions monthly
2. **Backup budget**: Export data before making major changes
3. **Keep history**: Archive old CSV files for future reference
4. **Document changes**: Note significant budget changes and why

---

## Keyboard Shortcuts

- **Ctrl/Cmd + F**: Focus search box (in transactions view)
- **Ctrl/Cmd + S**: Save budget (when in budget view)
- **Esc**: Clear search/filters
- **Arrow keys**: Navigate pagination

---

## Common Scenarios

### "I want to plan for a big purchase"
1. Go to **Financial Planning** view
2. Use **What-If Scenario Modeler**
3. Enter purchase details as monthly cost over loan period
4. See impact on monthly surplus
5. Use **Debt Payoff Accelerator** to optimize loan

### "I need to cut expenses"
1. Go to **Monthly Statements** view
2. Review last 3-6 months
3. Look at insights for high-spending categories
4. Go to **Transaction Explorer**
5. Filter by suspect categories
6. Review all transactions to find cuts
7. Update budget in **Budget Manager**

### "Planning for a life change"
1. Go to **Financial Planning** view
2. Create scenario with income/expense changes
3. Model in **Fortnightly Lifestyle Tuner**
4. Adjust essential vs discretionary split
5. Calculate required emergency fund
6. Update **Budget Manager** when changes occur

### "Tracking savings progress"
1. Use **Savings Goal Mapper** to set target
2. Review progress in **Monthly Statements**
3. Check savings rate trend over time
4. Adjust contributions based on surplus
5. Use **Retirement Projection** for long-term view

### "Understanding Airbnb performance"
1. **Overview** view shows net cash summary
2. **Monthly Statements** breaks down by month
3. **Airbnb Safety Buffer** models risk scenarios
4. Filter transactions for Airbnb-specific expenses
5. Compare to loan payment schedule

---

## Troubleshooting

### Data not showing
- Check that `financial_overview.json` exists in `data/` folder
- Regenerate data: `python3 scripts/generate_data.py`
- Refresh browser (Ctrl/Cmd + F5)
- Check browser console for errors (F12)

### Charts not loading
- Ensure internet connection (for Chart.js CDN)
- Try different browser
- Clear browser cache
- Check browser console for errors

### Budget not saving
- Check localStorage is enabled in browser
- Try incognito/private mode to test
- Export data before clearing browser data
- Use different browser

### Performance issues
- Large datasets (10,000+ transactions) may be slow
- Use date filters to limit displayed data
- Consider archiving old transactions
- Close other browser tabs

### Can't import data
- Ensure JSON file is valid format
- Check file was exported from same app version
- Try re-exporting and importing again
- Verify file isn't corrupted

---

## Data Privacy

- **All processing local**: No data sent to external servers
- **Browser storage only**: Data persists in your browser's localStorage
- **No tracking**: Application works completely offline after loading
- **Export control**: You control all data backups and exports

---

## Support & Feedback

For questions or issues:
1. Check this user guide
2. Review the README.md for technical details
3. Check browser console for error messages
4. Try regenerating data from source CSVs

---

**Last Updated**: September 2025  
**Version**: 2.0 - Complete Overhaul Edition