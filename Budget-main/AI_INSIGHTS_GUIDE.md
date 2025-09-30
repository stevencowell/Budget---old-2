# 🤖 AI Financial Assistant - Complete Guide

## Overview

The **AI Financial Assistant** is the most advanced feature of the Cowell Family Budget Command Centre. It uses intelligent algorithms to analyze your spending patterns, detect recurring payments, identify anomalies, and provide personalized recommendations for savings.

---

## 🎯 Key Features

### 1. **Subscription & Recurring Payment Detection**
The AI automatically scans all your transactions to identify recurring payments such as:
- Streaming services (Netflix, Spotify, Disney+)
- Software subscriptions (Adobe, Microsoft 365)
- Utilities and regular bills
- Insurance premiums
- Gym memberships
- Any merchant that charges you on a regular schedule

**How it works:**
- Groups transactions by merchant name
- Calculates intervals between charges
- Detects patterns (monthly, quarterly, annually, weekly, bi-weekly)
- Tracks payment status (Active, Inactive, Warning)
- Calculates annual cost for budgeting

**Example:** If you're charged $15.99 every 30 days by "NETFLIX AUSTRALIA PTY LTD", the AI will:
- Normalize the merchant name to "Netflix"
- Detect it as a Monthly subscription
- Calculate annual cost: $191.88
- Apply custom subcategory rules (e.g., "Subscriptions > Netflix")

### 2. **Enhanced Subcategory Management**
Go beyond basic categories to track exactly where your money is spent.

**Built-in Rules:**
- Netflix → Lifestyle & Shopping > Netflix
- Spotify → Lifestyle & Shopping > Spotify
- Disney+ → Lifestyle & Shopping > Disney+
- Claude AI → Professional > AI Tools
- ChatGPT → Professional > AI Tools
- Adobe → Professional > Software Subscriptions

**Custom Rules:**
You can create unlimited custom rules to automatically categorize transactions:
1. Click "+ Add Subcategory Rule"
2. Enter merchant keyword (e.g., "WOOLWORTHS")
3. Select category
4. Enter subcategory name
5. Run analysis again to apply

**Benefits:**
- Track individual subscription costs
- See exactly how much you spend on specific merchants
- Compare similar services (e.g., Netflix vs Disney+)
- Identify redundant subscriptions

### 3. **Anomaly Detection**
The AI uses statistical analysis to flag unusual spending patterns.

**Detection Methods:**
- **Z-Score Analysis**: Transactions more than 2 standard deviations from the mean
- **Duplicate Detection**: Same amount charged within 3 days
- **Timing Anomalies**: Multiple large transactions on the same day
- **Category Outliers**: Spending significantly higher than your typical pattern

**Priority Levels:**
- 🔴 **High Priority**: Z-score > 3, possible duplicates, or major deviations
- 🟡 **Medium Priority**: Z-score > 2, multiple large transactions same day
- 🟢 **Low Priority**: Minor deviations from normal patterns

**Example:**
If you typically spend $150/month at grocery stores, a $450 charge would be flagged as:
- Priority: High
- Reason: "Significantly higher than typical Groceries & Dining spending"
- Expected Range: "$100 - $200"

### 4. **AI-Powered Savings Opportunities**
The system analyzes your spending and provides actionable recommendations.

**Analysis Areas:**

**A. Subscription Optimization**
- Total subscription costs compared to income percentage
- Identifies inactive or forgotten subscriptions
- Suggests consolidation opportunities
- Recommends annual vs monthly payment options

**B. Category-Based Savings**
- **Groceries & Dining**: Compares to Australian household averages ($1,000/month benchmark)
- **Housing & Utilities**: Identifies potential provider switching opportunities (20% potential savings)
- **Transportation**: Flags excessive spending compared to recommended 15% of income
- **Entertainment**: Highlights discretionary spending above 8% of income

**C. Benchmark Comparisons**
Uses Australian household spending data to provide context:
- Average grocery spending
- Typical utility costs
- Recommended percentage of income per category

**Example Recommendations:**
```
💰 High Priority: Review Subscription Services
You have 12 recurring payments totaling $3,600 annually ($300/month). 
Consider auditing which services you actively use.

Action Steps:
• Cancel unused streaming services
• Check for duplicate subscriptions
• Look for annual payment discounts
• Share family plans where possible

Potential Savings: $90/month ($1,080 annually)
```

### 5. **Spending Score**
Get an overall financial health score from 0-100 based on:

**Scoring Factors:**
- **Savings Rate** (max -30 points if negative)
  - < 0%: -30 points
  - < 10%: -20 points
  - < 20%: -10 points
  - ≥ 20%: Full marks

- **Subscription Burden** (max -15 points)
  - > 5% of income: -15 points
  - > 3% of income: -5 points

- **Anomalies** (max -15 points)
  - > 5 high priority: -15 points
  - > 2 high priority: -10 points

- **Inactive Subscriptions** (-5 points each)

**Grade Scale:**
- 90-100: Excellent ✨
- 80-89: Good ✅
- 70-79: Fair 👍
- 60-69: Needs Improvement ⚠️
- 0-59: Critical 🚨

### 6. **Category Spending Trends**
Visual analysis of how spending in each category changes over time.

**Features:**
- Line chart showing monthly spending
- Average, minimum, and maximum values
- Trend analysis (increasing/decreasing)
- Percentage change from average

**Use Cases:**
- Identify seasonal spending patterns
- Track impact of lifestyle changes
- Validate budget adjustments
- Spot gradual cost creep

### 7. **Action Plan**
Prioritized list of immediate actions you can take.

**Includes:**
- Top 3 savings opportunities by potential impact
- High-priority anomalies requiring review
- Quick action steps for each item
- Estimated financial impact

**Example:**
```
#1 Cancel Inactive Subscriptions
Impact: $45/month | Category: Subscriptions
Quick Steps:
1. Review Disney+ - last seen 3 months ago
2. Review Gym Membership - last seen 2 months ago
```

---

## 📊 Dashboard Metrics

The AI Insights page provides four key metrics at a glance:

1. **Potential Monthly Savings**: Total savings from all identified opportunities
2. **Recurring Payments**: Number of active subscriptions detected
3. **Unusual Patterns**: Count of high-priority anomalies
4. **Spending Score**: Overall financial health (0-100)

---

## 🔧 How to Use

### Getting Started

1. **Navigate to AI Insights**
   - Click "🤖 AI Insights" in the navigation bar
   - The AI will automatically analyze your transactions on first load

2. **Review Summary Cards**
   - Check your spending score
   - Note potential monthly savings
   - See number of active subscriptions and anomalies

3. **Explore Subscriptions**
   - Scroll to "Subscription & Recurring Payment Analysis"
   - Review the table of detected subscriptions
   - Click "View Details" on any subscription to see payment history
   - Check for inactive subscriptions (marked with status badge)

4. **Review Savings Opportunities**
   - Read through AI-generated recommendations
   - Note the priority level (High, Medium, Low)
   - Review action steps for each opportunity
   - Consider potential savings amounts

5. **Check Anomalies**
   - Review unusual spending patterns
   - Use filters to show all or high priority only
   - Investigate flagged transactions
   - Verify amounts and ensure no fraud

6. **Manage Subcategories**
   - Scroll to "Enhanced Subcategory Management"
   - Review existing rules and their match counts
   - Add custom rules for your specific merchants
   - Edit or delete rules as needed

7. **Analyze Trends**
   - Select a category from the dropdown
   - View spending trends over time
   - Read AI-generated insights
   - Compare to your budget targets

8. **Follow Action Plan**
   - Review prioritized action items
   - Start with #1 (highest impact)
   - Complete quick steps
   - Track your progress

### Advanced Features

**Refresh Analysis**
- Click "🔄 Refresh Analysis" to re-run all AI algorithms
- Useful after:
  - Adding new subcategory rules
  - Uploading new transactions
  - Making category changes

**Export Insights**
- Click "Export Report" to download a JSON file
- Contains:
  - All detected subscriptions
  - Savings opportunities
  - Anomalies with details
  - Spending score and reasons
- Useful for:
  - Sharing with financial advisor
  - Record keeping
  - Analysis in other tools

**View Subscription Details**
- Click "View Details" on any subscription
- See:
  - Payment frequency and average amount
  - Annual cost projection
  - Complete payment history
  - Days between payments
  - Status indicator

---

## 🧠 Technical Details

### Subscription Detection Algorithm

```javascript
1. Group all expense transactions by normalized merchant name
2. For each merchant with 2+ transactions:
   a. Sort transactions by date
   b. Calculate intervals between consecutive transactions
   c. Calculate average interval
   d. Check if intervals are consistent (within 20% variance)
   e. If consistent and ≥ 7 days:
      - Classify frequency (weekly, bi-weekly, monthly, quarterly, annual)
      - Calculate average amount
      - Determine status based on last transaction date
      - Apply subcategory rules
      - Calculate annual cost
3. Sort by annual cost (descending)
```

### Anomaly Detection Algorithm

```javascript
1. Group transactions by category-subcategory
2. For each group with 3+ transactions:
   a. Calculate mean and standard deviation
   b. For each transaction:
      - Calculate Z-score: (amount - mean) / stdDev
      - If |Z-score| > 2 and amount > mean * 1.5:
        * Flag as anomaly
        * Priority = High if Z-score > 3
        * Priority = Medium otherwise
   c. Check for duplicates (same amount within 3 days)
   d. Flag duplicates as High priority

3. Detect timing anomalies:
   - Group large transactions (>$100) by date
   - Flag if 3+ large transactions on same day

4. Sort by priority and amount
```

### Spending Score Calculation

```javascript
Starting Score: 100

Deductions:
- Savings Rate:
  * -30 if negative
  * -20 if < 10%
  * -10 if < 20%

- Subscription Burden:
  * -15 if > 5% of income
  * -5 if > 3% of income

- High Priority Anomalies:
  * -15 if > 5 anomalies
  * -10 if > 2 anomalies

- Inactive Subscriptions:
  * -5 per inactive subscription

Final Score: max(0, min(100, score))

Grade:
- ≥ 90: Excellent
- ≥ 80: Good
- ≥ 70: Fair
- ≥ 60: Needs Improvement
- < 60: Critical
```

---

## 💡 Best Practices

### 1. **Regular Review**
- Check AI Insights weekly to stay on top of spending
- Review anomalies promptly to catch errors or fraud
- Update subcategory rules as you discover new merchants

### 2. **Act on Recommendations**
- Start with High Priority items
- Focus on largest potential savings first
- Set calendar reminders to cancel unused subscriptions
- Review and implement one recommendation per week

### 3. **Customize for Your Needs**
- Add subcategory rules for all your regular merchants
- Create granular categories for areas you want to track closely
- Export data regularly for external analysis

### 4. **Track Progress**
- Note your Spending Score monthly
- Track how potential savings decreases over time
- Celebrate improvements in your score

### 5. **Combine with Budget Manager**
- Use AI Insights to identify problem areas
- Adjust budgets in Budget Manager accordingly
- Monitor actual vs budgeted in both views

---

## 📈 Success Stories

### Example 1: Subscription Cleanup
**Before:**
- 15 active subscriptions
- $425/month in recurring charges
- Spending Score: 68 (Fair)

**After AI Review:**
- Cancelled 5 unused subscriptions (Disney+, unused gym, old streaming services)
- Switched 2 subscriptions to annual payment (10% discount)
- **Savings:** $125/month ($1,500/year)
- **New Spending Score:** 82 (Good)

### Example 2: Grocery Optimization
**AI Insight:**
"Spending $1,450/month on groceries and dining, $450 above Australian average."

**Action Taken:**
- Started meal planning
- Switched to generic brands
- Reduced dining out from 8 to 3 times per month

**Result:**
- Reduced to $1,100/month
- **Savings:** $350/month ($4,200/year)

### Example 3: Utility Review
**AI Insight:**
"Utility costs average $520/month. Consider switching providers."

**Action Taken:**
- Compared electricity providers
- Switched internet plan
- Bundled services

**Result:**
- Reduced to $395/month
- **Savings:** $125/month ($1,500/year)

---

## ⚙️ Data Storage & Privacy

### What's Stored

**LocalStorage Keys:**
- `cowell_budget_subcategory_rules`: Your custom subcategory rules
- `cowell_budget_category_changes`: Manual category assignments

### What's NOT Stored

- Transaction data (loaded fresh each time)
- Analysis results (calculated on-demand)
- Anomaly detections (regenerated each session)
- Spending scores (recalculated on each load)

### Privacy

✅ **All analysis happens in your browser**
- No data sent to external servers
- No tracking or analytics
- Complete privacy

⚠️ **Browser-Specific**
- Rules and changes are stored per browser
- Won't sync across devices
- Clearing browser data will reset customizations

💾 **Backup Recommendation**
- Export your insights regularly
- Save the exported JSON file
- Restore by re-creating rules if needed

---

## 🐛 Troubleshooting

### "Analyzing..." doesn't finish
**Cause:** Large transaction dataset or browser performance
**Solution:** 
- Wait up to 30 seconds for analysis
- Refresh the page
- Try in a different browser

### No subscriptions detected
**Cause:** Insufficient transaction history or irregular patterns
**Solution:**
- Ensure you have at least 3 months of transaction data
- Check that merchants have at least 2 transactions
- Verify transactions are properly categorized as expenses

### Anomalies seem incorrect
**Cause:** Natural spending variations or insufficient data
**Solution:**
- Review each anomaly to understand why it was flagged
- Consider that seasonal purchases may appear anomalous
- Use the "High Priority Only" filter to focus on serious issues

### Subcategory rules not applying
**Cause:** Rules haven't been re-applied
**Solution:**
- Click "🔄 Refresh Analysis" after adding rules
- Check keyword spelling (case-insensitive)
- Ensure keyword appears in transaction descriptions

### Savings estimates seem too high
**Cause:** Conservative assumptions in calculations
**Solution:**
- Review each recommendation individually
- Use estimates as potential maximum savings
- Focus on actionable items rather than total savings

---

## 🚀 Future Enhancements

Planned features for future versions:

1. **Machine Learning**
   - Learn from your category corrections
   - Improve anomaly detection accuracy
   - Personalize spending benchmarks

2. **Predictive Analytics**
   - Forecast future expenses
   - Predict upcoming subscription charges
   - Warn of potential budget overruns

3. **Goal Tracking**
   - Set savings targets
   - Track progress toward goals
   - Celebrate milestones

4. **Comparison Tools**
   - Compare your spending to similar households
   - Benchmark against regional averages
   - See where you're doing well vs needs improvement

5. **AI Chat Assistant**
   - Ask questions about your spending
   - Get personalized advice
   - Natural language financial queries

6. **Automated Actions**
   - One-click apply recommendations
   - Scheduled analysis reports
   - Email alerts for anomalies

7. **Integration**
   - Direct bank feed imports
   - Export to accounting software
   - Sync across devices

---

## 📚 Additional Resources

- **Main Documentation**: See [README.md](README.md)
- **Category Manager**: See [CATEGORY_MANAGER_GUIDE.md](CATEGORY_MANAGER_GUIDE.md)
- **Quick Start**: See [QUICK_START.md](QUICK_START.md)
- **Feature List**: See [FEATURES.md](FEATURES.md)

---

## 💬 Support

For questions or issues with the AI Financial Assistant:

1. Check this guide first
2. Review the troubleshooting section
3. Consult the related documentation files
4. Export your data for analysis

---

## 🎉 Get Started Now!

1. Open the app in your browser
2. Click **🤖 AI Insights** in the navigation
3. Review your Spending Score
4. Read through the top 3 savings opportunities
5. Take action on Priority #1 in the Action Plan

**Remember:** Even small improvements add up over time. Start with one recommendation and build from there!

---

*Built with ❤️ for Steve & Anne Cowell*
*Last Updated: September 30, 2025*