# Quick Reference Card

## 🚀 Starting the App
```bash
./start_server.sh
```
Then open: `http://localhost:8000/web/`

---

## 📍 Navigation
| View | Purpose |
|------|---------|
| **Overview** | Dashboard with key metrics, trends, and charts |
| **Budget Manager** | Create, edit, and track your budget |
| **Monthly Statements** | Detailed monthly analysis with insights |
| **Financial Planning** | Calculators for savings, debt, retirement, scenarios |
| **Transactions** | Search, filter, and manage all transactions |

---

## 💰 Budget Manager

### Quick Actions
| Action | How |
|--------|-----|
| Add item | Click "+ Add Budget Item" → Fill form |
| Edit item | Click "Edit" → Update values |
| Duplicate | Click "Duplicate" → Creates copy |
| Save | Click "Save Budget" → Persists changes |
| Reset | Click "Reset to Defaults" → Discards changes |
| Export | Click "Export Data" → Downloads JSON |
| Import | Click "Import Data" → Restores from JSON |

### Reading the Table
- **Variance**: Difference between actual and budget
- **Green**: Under budget (good for expenses)
- **Orange**: Over budget (review needed)
- **% of Budget**: How much you've used

---

## 📅 Monthly Statements

### Key Metrics
- **Income**: Total money received
- **Expenses**: Total money spent
- **Net**: Income minus expenses
- **Savings Rate**: % of income saved

### Insights Legend
- ✅ = Positive achievement
- ⚠️ = Needs attention
- 💡 = Suggestion
- 📊 = Data observation

### Quick Actions
1. Select month from dropdown
2. Review summary cards
3. Check category chart
4. Read insights for recommendations

---

## 🎯 Financial Calculators

### Fortnightly Tuner
**Use for**: Optimizing fortnightly spending
**Key inputs**: Income, essentials, flexible spending
**Output**: Available surplus for savings

### Savings Goal Mapper
**Use for**: Planning major purchases or goals
**Key inputs**: Goal amount, current savings, monthly contribution, interest rate
**Output**: Timeline to reach goal with compound interest

### Debt Payoff Accelerator
**Use for**: Optimizing loan repayment
**Key inputs**: Balance, rate, minimum payment, extra payment
**Output**: Time and interest saved

### Airbnb Buffer
**Use for**: Risk planning for rental property
**Key inputs**: Income drop % (slider)
**Output**: Required emergency reserve

### Retirement Projection
**Use for**: Long-term retirement planning
**Key inputs**: Current balance, monthly contribution, years, return %
**Output**: Projected retirement balance and income

### Scenario Modeler
**Use for**: Testing major financial decisions
**How**: Add scenarios with monthly cost and duration
**Output**: Impact on monthly surplus

---

## 🔍 Transaction Explorer

### Search & Filter
| Filter | Purpose |
|--------|---------|
| **Search box** | Find by merchant name or description |
| **Category** | Filter by spending category |
| **Type** | Show only income or expenses |
| **Date from/to** | Limit to date range |
| **Clear Filters** | Reset all filters |

### Statistics Bar
- **Showing**: Count of filtered transactions
- **Total**: Sum of filtered transaction amounts

### Actions
- **Edit**: Change transaction amount
- **Delete**: Remove from view (not permanent)
- **Pagination**: Navigate through pages (50 per page)

---

## 📊 Charts

### Monthly Trend Chart (Overview)
- **Lines**: Income (green), Expenses (orange), Net (blue)
- **Controls**: Toggle each line on/off
- **Hover**: See exact values for each month

### Category Pie Chart (Overview)
- **Shows**: Top 8 expense categories
- **Hover**: See amount and percentage
- **Legend**: Click to toggle categories

### Budget Progress Chart (Budget Manager)
- **Bars**: Budgeted (blue) vs Actual (orange)
- **Horizontal**: Easier to read long category names
- **Shows**: Top 15 budget items with data

### Monthly Category Chart (Statements)
- **Shows**: Spending by category for selected month
- **Updates**: Automatically when month changes
- **Hover**: See exact amounts

---

## 💾 Data Management

### Regular Updates
1. Download new CSVs from bank
2. Replace old files
3. Run: `python3 scripts/generate_data.py`
4. Refresh browser

### Backup Your Work
1. Click "Export Data"
2. Save JSON file somewhere safe
3. Do this monthly or before major changes

### Restore from Backup
1. Click "Import Data"
2. Select your JSON file
3. Confirm import
4. Page refreshes with restored data

---

## 🎨 Color Guide

| Color | Meaning |
|-------|---------|
| 🟢 Green | Positive/income/under budget |
| 🟠 Orange | Negative/expense/over budget |
| 🔵 Blue | Neutral/informational |
| ⚪ Gray | Muted/secondary info |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl/Cmd + F** | Focus search (in transactions) |
| **Ctrl/Cmd + S** | Save budget |
| **Esc** | Clear filters |
| **Arrow keys** | Navigate pagination |

---

## 🆘 Common Issues

### Data not loading
1. Check `data/financial_overview.json` exists
2. Run `python3 scripts/generate_data.py`
3. Hard refresh browser (Ctrl+F5)

### Charts not showing
1. Check internet connection (for Chart.js)
2. Try different browser
3. Clear cache

### Budget not saving
1. Check localStorage is enabled
2. Try exporting as backup
3. Use different browser

---

## 💡 Pro Tips

### Budget Management
- Start conservative with budget estimates
- Review and adjust monthly
- Export data before major changes
- Use duplication for similar items

### Monthly Analysis
- Review last 3-6 months for trends
- Target 20%+ savings rate
- Investigate unusual months
- Follow insight recommendations

### Financial Planning
- Model before making major decisions
- Use conservative estimates
- Factor 2-3% inflation
- Build emergency fund first

### Transaction Management
- Review weekly to catch errors early
- Use search to find specific merchants
- Filter by category to review spending areas
- Edit amounts to correct mistakes

---

## 📱 Mobile Usage

The app is fully responsive:
- Horizontal scroll for wide tables
- Touch-friendly buttons
- Collapsible navigation
- Optimized for tablets and phones

---

## 🔒 Privacy Notes

✅ All data stored locally in browser  
✅ No external servers  
✅ No tracking or analytics  
✅ Works offline after initial load  
✅ You control all data  

---

## 📞 Need Help?

1. **USER_GUIDE.md** - Detailed instructions
2. **README.md** - Technical documentation
3. **CHANGELOG.md** - What's new
4. Browser console (F12) - Error messages

---

**Quick Start Checklist**
- [ ] CSVs in project root
- [ ] Run `python3 scripts/generate_data.py`
- [ ] Start server: `./start_server.sh`
- [ ] Open `http://localhost:8000/web/`
- [ ] Navigate views with top menu
- [ ] Edit budget and save
- [ ] Review monthly statements
- [ ] Try financial calculators
- [ ] Search transactions
- [ ] Export data for backup

---

**Version**: 2.0  
**Last Updated**: September 2025