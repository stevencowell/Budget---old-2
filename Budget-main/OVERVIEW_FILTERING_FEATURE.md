# Overview Date Filtering Feature

## Overview

The Cowell Family Budget Command Centre now includes comprehensive date filtering for the Overview tab. This allows you to analyze your financial data for specific time periods or custom date ranges.

## Features

### Filter Options

#### 1. **All Time**
- Shows all 13 months of data (September 2024 - September 2025)
- Default view when you first open the application
- Displays complete financial history

#### 2. **Last 12 Months**
- Shows data from the last 12 months from today's date
- Automatically calculates the start date
- Updates dynamically based on current date

#### 3. **Last 6 Months**
- Shows data from the last 6 months
- Perfect for medium-term trend analysis
- Automatically adjusts based on current date

#### 4. **Last 3 Months**
- Shows data from the last 3 months
- Great for recent spending patterns
- Quarterly review capability

#### 5. **Year to Date (YTD)**
- Shows data from January 1st of the current year to present
- Useful for annual budgeting and tax planning
- Updates automatically as months progress

#### 6. **Custom Date Range**
- Select any start and end month
- Use month picker inputs (YYYY-MM format)
- Flexible analysis for any time period you need

### What Gets Filtered

When you apply a date filter, **ALL** overview components update automatically:

#### Financial Snapshot Cards
- **Household Income**: Recalculated for selected period
- **Total Spending**: Updated to show expenses in date range
- **Net Position**: Income minus expenses for the period
- **Airbnb Net Cash**: Limited to selected months

#### Charts
- **Financial Trends**: Line chart shows only selected months
- **Category Distribution**: Pie chart recalculates percentages for the period

#### Category Breakdown
- **Where the money goes**: Bar chart updates with filtered data
- Click categories to see transactions within the date range

#### Lists
- **Top Spending Partners**: Top 10 merchants recalculated for the period
- **Reliable Income Sources**: Income categories ranked for selected dates

## How to Use

### Quick Filtering

1. **Navigate to Overview Tab**
   - Click "Overview" in the main navigation

2. **Select a Period**
   - Find the "Overview Filters" section at the top
   - Click the "Period" dropdown
   - Choose from: All Time, Last 12 Months, Last 6 Months, Last 3 Months, YTD, or Custom Date Range

3. **View Updated Data**
   - All charts, graphs, and summaries update instantly
   - Period label shows number of months included

### Custom Date Range

1. **Select Custom Period**
   - Choose "Custom Date Range" from the Period dropdown

2. **Set Start Date**
   - Click "From" month picker
   - Select starting month (e.g., "2024-09" for September 2024)

3. **Set End Date**
   - Click "To" month picker
   - Select ending month (e.g., "2025-09" for September 2025)

4. **Review Results**
   - Data updates automatically as you change dates
   - All overview components reflect the custom range

### Clear Filters

- Click the "Clear Filters" button to reset to "All Time"
- Date inputs reset to show full available date range
- All data returns to showing complete 13-month history

## Use Cases

### Monthly Budget Review
```
Period: Last 3 Months
Use Case: Review recent spending trends
```

### Semi-Annual Planning
```
Period: Last 6 Months
Use Case: Mid-year budget adjustment and forecasting
```

### Annual Tax Preparation
```
Period: Custom Date Range
From: 2024-07 (July 2024)
To: 2025-06 (June 2025)
Use Case: Financial year analysis for tax purposes
```

### Quarterly Performance
```
Period: Last 3 Months
Use Case: Quarterly financial review
```

### Year-to-Date Analysis
```
Period: Year to Date
Use Case: Track progress against annual goals
```

### Comparative Analysis
```
Period: Custom Date Range
From: 2024-09
To: 2024-12
Use Case: Compare Q4 2024 vs Q1 2025 spending
```

## Technical Details

### Data Calculation

#### Metrics Recalculation
- **Total Income**: Sum of all income in filtered months
- **Total Expenses**: Sum of all expenses in date range
- **Net Position**: Income minus expenses for the period
- **Savings Rate**: (Net Position / Total Income) × 100
- **Average Monthly Net**: Net position divided by number of months

#### Category Aggregation
- Transactions filtered by date first
- Then aggregated by category
- Income and expense totals calculated per category
- Percentages recalculated based on filtered data

#### Top Merchants & Income
- Only transactions within date range considered
- Top 10 merchants by total spending
- Top 10 income sources by total amount

### Performance
- **Instant Filtering**: All calculations happen in browser
- **No Server Required**: Pure client-side JavaScript
- **Smooth Updates**: Charts animate transitions between filters
- **Efficient**: Works with 1,522 transactions across 13 months

## Filter Persistence

### Session Behavior
- Filters reset when you navigate away from Overview tab
- Returning to Overview shows "All Time" by default
- This ensures you always see complete picture when starting fresh

### Future Enhancement Ideas
- Save favorite filters to localStorage
- Remember last used filter across sessions
- Export filtered data as CSV or PDF
- Compare two time periods side-by-side

## Troubleshooting

### No Data Showing
**Problem**: Charts or cards show zero or empty
**Solution**: 
- Check if date range includes any data
- Verify "From" date is before "To" date
- Click "Clear Filters" to reset

### Custom Dates Not Working
**Problem**: Custom date range not updating data
**Solution**:
- Ensure "Custom Date Range" is selected in Period dropdown
- Set both From and To dates
- Dates must be in YYYY-MM format

### Charts Not Updating
**Problem**: Charts don't refresh when changing filters
**Solution**:
- Refresh the browser page
- Clear browser cache
- Check browser console for errors

### Date Picker Issues
**Problem**: Can't select dates outside available range
**Solution**:
- Date pickers are limited to available data months
- Data range: September 2024 - September 2025
- Cannot select dates outside this range

## Browser Compatibility

### Supported Browsers
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+

### Month Input Support
The `<input type="month">` picker is supported in all modern browsers. If you're using an older browser, you'll see a text input instead.

## Examples

### Example 1: Review Last Quarter
1. Go to Overview tab
2. Select "Last 3 Months" from Period dropdown
3. View updated spending patterns and income
4. Identify any unusual spikes in categories

### Example 2: Compare Spending Periods
**First Period:**
1. Select "Custom Date Range"
2. From: 2024-09, To: 2024-11
3. Note total spending amount

**Second Period:**
1. From: 2025-06, To: 2025-08
2. To: 2025-08
3. Compare with first period

### Example 3: Tax Year Analysis
1. Select "Custom Date Range"
2. Set financial year: July 2024 - June 2025
3. Review total income and deductible expenses
4. Export data for tax preparation

## Tips

### Best Practices
- **Start with All Time** to see the big picture
- **Use Last 3 Months** for current spending behavior
- **Use YTD** for annual budget tracking
- **Use Custom** for specific analysis needs

### Quick Analysis Workflow
1. Start with "All Time" overview
2. Notice interesting trends in specific periods
3. Switch to "Custom Date Range"
4. Narrow down to specific months for deep dive
5. Use findings to adjust budget or spending

## Summary

The Overview date filtering feature provides powerful tools to analyze your financial data across any time period. Whether you're doing monthly reviews, quarterly planning, or annual tax preparation, you can now focus on exactly the time period you need.

**Key Benefits:**
- ✅ Flexible date range selection
- ✅ Instant data updates
- ✅ All charts and summaries recalculated
- ✅ Easy-to-use interface
- ✅ No server calls required

**Quick Access:**
- Navigate: Overview tab → Overview Filters section
- Common filters: Last 3 Months, Last 6 Months, YTD
- Custom analysis: Select "Custom Date Range"