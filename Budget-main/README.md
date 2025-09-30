# Cowell Family Budget Command Centre

A comprehensive financial management dashboard and planning toolkit designed for the Cowell family. This application combines real transaction data, household budgeting, and powerful calculators to provide complete control over your finances.

## 🌟 Key Features

### 📊 **Overview Dashboard**
- **Real-time financial snapshot** with key metrics (income, expenses, net position, savings rate)
- **Date filtering** - Filter all overview data by months or custom date ranges (NEW!)
  - Last 12/6/3 months, Year to Date, or custom range
  - All charts and summaries update instantly
- **Interactive trend charts** visualizing monthly cashflow patterns
- **Category breakdowns** showing spending distribution
- **Airbnb performance tracking** separate from household finances
- **Top merchants and income sources** ranked by total amounts

### 💰 **Budget Manager**
- **Create and modify budget items** with inline editing
- **Add new budget categories** on the fly
- **Track budget vs actual performance** with variance calculations
- **Visual progress charts** comparing budgeted vs actual spending
- **Percentage of budget tracking** to identify over/under spending
- **Duplicate budget items** for easy category creation
- **Save and restore budgets** with localStorage persistence
- **Export/import budget data** for backup and sharing

### 📅 **Monthly Statement Analysis**
- **Detailed monthly breakdowns** with income, expenses, and net position
- **Month-over-month comparisons** highlighting trends
- **Savings rate calculations** for each month
- **Category distribution charts** for monthly spending
- **AI-powered insights** identifying opportunities for improvement
- **Downloadable statements** (PDF generation ready)
- **Quick navigation** from cashflow table to statement details

### 🤖 **AI Financial Assistant** (NEW!)
The most powerful feature of the app - your personal financial advisor powered by intelligent algorithms.

#### Subscription & Recurring Payment Detection
- **Automatically identifies** all recurring payments (monthly, quarterly, annual)
- **Tracks payment status** (Active, Inactive, Warning)
- **Calculates annual costs** for budgeting
- **Detailed payment history** with frequency analysis
- **Smart merchant recognition** (e.g., "NETFLIX AUSTRALIA PTY LTD" → "Netflix")

#### Enhanced Subcategory Management
- **Granular expense tracking** - Create custom subcategories like "Netflix", "Spotify", "Gym"
- **Built-in merchant rules** for common subscriptions
- **Custom rule engine** - Add unlimited rules for your specific merchants
- **Automatic categorization** - Keyword matching with pattern recognition
- **Match counter** - Track rule effectiveness

#### AI-Powered Savings Opportunities
- **Personalized recommendations** based on YOUR spending patterns
- **Actionable insights** with specific steps to take
- **Potential savings calculator** - See how much you could save monthly/annually
- **Priority rankings** (High/Medium/Low) to focus efforts
- **Category analysis:**
  - Subscription optimization
  - Grocery & dining savings
  - Utility provider comparisons
  - Benchmark-based recommendations

#### Anomaly & Pattern Detection
- **Statistical analysis** identifies unusual transactions
- **Z-score algorithm** flags spending > 2 standard deviations
- **Duplicate detection** catches billing errors
- **Timing analysis** spots unusual spending spikes
- **Fraud protection** - Early warning for suspicious activity

#### Spending Score (0-100)
- **Comprehensive financial health metric**
- **Factors considered:**
  - Savings rate
  - Subscription burden
  - Anomaly count
  - Inactive subscriptions
- **Grade system:** Excellent → Critical
- **Detailed breakdown** of score factors

#### Category Trend Analysis
- **Visual spending trends** over time per category
- **Statistical insights** (average, min, max, trend direction)
- **Interactive charts** with month-by-month breakdown
- **Pattern identification** for better budgeting

#### Prioritized Action Plan
- **Top 3 savings opportunities** by impact
- **High-priority anomalies** requiring attention
- **Quick action steps** for each recommendation
- **Financial impact estimates** ($/month)

📖 **See [AI_INSIGHTS_GUIDE.md](AI_INSIGHTS_GUIDE.md) for complete documentation**

### 🎯 **Financial Planning Studio**

#### Fortnightly Lifestyle Tuner
- Model your fortnightly income and expenses
- Calculate available funds for savings or debt repayment
- Adjust essential vs flexible spending

#### Savings Goal Mapper
- Set savings targets with timelines
- Factor in compound interest growth
- See total contributions vs investment growth
- Calculate realistic achievement dates

#### Debt Payoff Accelerator
- Compare minimum vs accelerated payment plans
- Calculate interest savings from extra payments
- See how much faster you'll be debt-free
- Visualize total cost differences

#### Airbnb Safety Buffer
- Model income drops from vacancy periods
- Calculate emergency fund requirements
- Stress test your rental property finances

#### Retirement Projection
- Project retirement savings with compound growth
- Factor in regular contributions
- Calculate sustainable withdrawal rates
- Plan retirement income streams

#### What-If Scenario Modeler
- Create and save multiple financial scenarios
- Compare side-by-side impacts on monthly surplus
- Model major purchases or life changes
- Track cumulative effects over time

### 🔍 **Transaction Explorer**
- **Advanced filtering** by category, type, and date range
- **Full-text search** across transaction descriptions
- **Pagination** for efficient browsing of large datasets
- **Real-time statistics** showing filtered totals
- **Edit transaction amounts** for corrections
- **Delete unwanted transactions** from view
- **Export filtered results** (feature-ready)

### 📈 **Data Visualization**
- **Line charts** for trend analysis
- **Pie charts** for category distribution
- **Bar charts** for budget comparisons
- **Interactive controls** to show/hide data series
- **Responsive charts** that work on all devices

### 💾 **Data Management**
- **Local storage persistence** for all modifications
- **Export data** to JSON for backup
- **Import data** to restore or share budgets
- **Reset to defaults** if needed
- **Automatic data generation** from CSV files

## 🚀 Getting Started

### Prerequisites
- Python 3.7 or higher
- Modern web browser (Chrome, Firefox, Safari, Edge)
- CSV transaction exports from your bank

### Initial Setup

1. **Place your transaction files** in the project root:
   - `1095801S1_04Z87L1V.CSV` (Joint account)
   - `9351515S1_04Z87L70.CSV` (Supporting account)

2. **Add your budget spreadsheet**:
   - `budget.xlsx` with your annual budget allocations

### New: Overview Date Filtering ✨

The Overview tab now includes powerful date filtering! 

**Quick access:** Overview tab → Overview Filters section at the top

**Filter options:**
- Last 12/6/3 months for recent trends
- Year to Date for annual tracking
- Custom Date Range for any period
- All Time to see everything

**See detailed guide:** [QUICK_GUIDE_OVERVIEW_FILTERS.md](QUICK_GUIDE_OVERVIEW_FILTERS.md)

3. **Generate the financial data**:
   ```bash
   python scripts/generate_data.py
   ```
   This creates `data/financial_overview.json` with all aggregated financial information.

4. **Launch the web application**:
   ```bash
   python -m http.server 8000
   ```

5. **Open in your browser**:
   Navigate to [http://localhost:8000/web/](http://localhost:8000/web/)

## 📁 Project Structure

```
├── data/
│   └── financial_overview.json   # Generated financial data
├── scripts/
│   └── generate_data.py          # Transaction processing & aggregation
├── web/
│   ├── index.html                # Main application interface
│   ├── main.js                   # Application logic & interactivity
│   └── styles.css                # Styling & responsive design
├── 1095801S1_04Z87L1V.CSV        # Joint account transactions
├── 9351515S1_04Z87L70.CSV        # Supporting account transactions
├── budget.xlsx                   # Annual budget worksheet
├── Anne's Tax 2024-25.docx       # Reference documents
└── Steve's Tax 2024-25.pdf       # Reference documents
```

## 🔧 Customization

### Adding New Transaction Categories

Edit `scripts/generate_data.py` and update the `classify_transaction` function:

```python
if "YOUR_MERCHANT" in text:
    tx.category = "Your Category"
    tx.subcategory = "Your Subcategory"
    tx.type = "expense"  # or "income"
    return
```

Then regenerate the data:
```bash
python scripts/generate_data.py
```

### Modifying Budget Categories

Use the Budget Manager view in the web interface to:
- Add new budget items with the "+ Add Budget Item" button
- Edit existing items by clicking "Edit" in the actions column
- Duplicate items for similar categories
- Save your changes with the "Save Budget" button

### Creating Custom Calculators

The planning calculators are modular. To add a new calculator:

1. Add HTML structure in `web/index.html` within the `#planning-view` section
2. Create initialization function in `web/main.js`
3. Call your function from the main `init()` function

## 💡 Usage Tips

### Budget Management
- **Start with actual data**: Let the system calculate your actuals from transactions
- **Adjust gradually**: Make small changes and save frequently
- **Use duplication**: When adding similar categories, duplicate and modify existing items
- **Export regularly**: Back up your budget data monthly

### Monthly Statements
- **Review insights**: The AI-generated insights highlight key opportunities
- **Compare months**: Use month-over-month changes to spot trends
- **Track savings rate**: Aim for 20%+ for healthy financial growth

### Financial Planning
- **Test scenarios**: Use the what-if modeler before making major decisions
- **Model debt payoff**: See real savings from extra payments
- **Plan savings**: Factor in compound interest for long-term goals
- **Buffer calculations**: Keep emergency funds for investment properties

### Transaction Management
- **Filter strategically**: Use category filters to review specific spending areas
- **Search for merchants**: Find all transactions from specific vendors
- **Date range analysis**: Compare spending across different time periods
- **Clean up data**: Remove or edit anomalies as needed

## 🔄 Data Updates

### Regular Updates
To keep your dashboard current:

1. **Download new transaction CSVs** from your bank
2. **Replace old CSV files** with updated versions
3. **Regenerate data**:
   ```bash
   python scripts/generate_data.py
   ```
4. **Refresh your browser** to see updated information

### Recommended Frequency
- **Monthly updates**: Download transactions at month-end
- **Quarterly reviews**: Deep dive into budget performance
- **Annual planning**: Reset budget and set new goals

## 🎨 Customization Options

### Styling
All colors and styling are defined in CSS variables at the top of `styles.css`:

```css
:root {
  --bg: #0f172a;          /* Background color */
  --accent: #38bdf8;       /* Primary accent */
  --positive: #4ade80;     /* Positive values */
  --negative: #f97316;     /* Negative values */
}
```

### Categories
Essential vs discretionary spending is determined by the `ESSENTIAL_SUBCATEGORIES` set in `scripts/generate_data.py`. Modify this to match your definition of essential expenses.

### Chart Colors
Chart colors are defined inline in the chart creation functions in `main.js`. Modify the `backgroundColor` arrays to customize.

## 🐛 Troubleshooting

### Data Not Loading
- Check browser console for errors (F12)
- Verify `financial_overview.json` exists in the `data/` directory
- Ensure CSV files are in the correct format
- Try regenerating data with `python scripts/generate_data.py`

### Charts Not Displaying
- Verify Chart.js CDN is accessible
- Check browser console for JavaScript errors
- Ensure you have data for the requested time period

### Budget Changes Not Saving
- Check browser's localStorage isn't disabled
- Try a different browser
- Export your data before resetting

### Performance Issues
- Large transaction datasets (>10,000) may slow filtering
- Consider archiving old transactions
- Use date range filters to limit displayed data

## 🔒 Privacy & Security

- **All data stored locally**: No data is sent to external servers
- **No tracking**: Application works completely offline after loading
- **Secure storage**: Uses browser localStorage for persistence
- **Export for backup**: Regular exports recommended for data safety

## 🚀 Advanced Features

### PDF Export (Coming Soon)
Statement download functionality is ready for integration with jsPDF library.

### Multi-Currency Support
To add currency support, modify the `currency` formatters in `main.js`.

### Auto-Classification Learning
The transaction classifier can be enhanced with machine learning for better categorization over time.

## 📊 Performance Metrics

The application tracks and displays:
- **Total income and expenses** over 12 months
- **Net position** and savings rate
- **Essential vs discretionary** spending breakdown
- **Category distributions** and trends
- **Merchant analysis** for top spending partners
- **Monthly cashflow** patterns and anomalies

## 🤝 Contributing

This is a personal family budget tool, but the code can be adapted for other families:

1. Fork the repository
2. Update CSV filenames and formats
3. Modify transaction classification rules
4. Customize categories and budget items
5. Adjust calculators for your needs

## 📝 Notes

- **12-month window**: Data covers rolling 12-month period ending current month
- **Transfer handling**: Internal transfers excluded from income/expense totals
- **Property tracking**: Airbnb transactions tagged and reported separately
- **Budget year**: Assumes annual budget amounts for comparison

## 🎯 Future Enhancements

Potential features for future development:
- Mobile app version
- Automated bank feed integration
- Receipt photo attachment
- Multi-user access with sync
- ~~AI-powered spending recommendations~~ ✅ **COMPLETED** (See AI Insights)
- Goal tracking with milestones
- Investment portfolio tracking
- Tax optimization tools
- Predictive analytics for future spending
- Machine learning categorization

## 📚 Documentation

### Complete Guides
- **[AI_INSIGHTS_GUIDE.md](AI_INSIGHTS_GUIDE.md)** - Complete guide to the AI Financial Assistant (8,500+ words)
- **[AI_INSIGHTS_QUICK_REFERENCE.md](AI_INSIGHTS_QUICK_REFERENCE.md)** - Quick reference card for daily use
- **[AI_IMPLEMENTATION_SUMMARY.md](AI_IMPLEMENTATION_SUMMARY.md)** - Technical implementation details
- **[CATEGORY_MANAGER_GUIDE.md](CATEGORY_MANAGER_GUIDE.md)** - Category management documentation
- **[QUICK_START.md](QUICK_START.md)** - Get started in 5 minutes
- **[FEATURES.md](FEATURES.md)** - Comprehensive feature list

### Quick References
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Common tasks and shortcuts
- **[USER_GUIDE.md](USER_GUIDE.md)** - End-user documentation

---

**Built with ❤️ for Steve & Anne to stay confident, proactive, and in sync with their financial goals.**

**Latest Major Update:** 🤖 AI Financial Assistant - Your intelligent personal financial advisor (September 30, 2025)