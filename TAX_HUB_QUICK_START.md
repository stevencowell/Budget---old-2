# 💰 Tax Hub - Quick Start Guide

## How to Access

1. Open your Budget Command Centre: `http://localhost:8000` (or your app URL)
2. Click the **💰 Tax Hub** button in the navigation bar
3. That's it! All your tax data loads automatically

---

## What You'll See

### Top Section: Tax Summary (4 Cards)
```
┌─────────────────────────────────────────────────────────────────┐
│ 💵 Estimated Tax Payable    │ 📊 Taxable Income              │
│    $X,XXX                    │    $XX,XXX                     │
│    Based on current income   │    After deductions            │
├─────────────────────────────────────────────────────────────────┤
│ 💰 Total Deductions         │ 📈 Effective Tax Rate          │
│    $XX,XXX                   │    XX.X%                       │
│    Tax-deductible expenses   │    Your actual tax percentage  │
└─────────────────────────────────────────────────────────────────┘
```

### Income Breakdown Table
Shows where your income comes from:
- Salary & Wages
- Airbnb Income  
- Other Income
Plus percentages and tax treatment

### Tax Calculator
Two side-by-side panels:
- **Left:** Interactive calculator (pre-filled with your data)
- **Right:** 2024-25 tax brackets reference

### Deductions Tracker
Table showing all your tax-deductible expenses (Airbnb costs, etc.)

### Quarterly PAYG Estimates
Four cards showing estimated quarterly tax payments:
- Q1 (Jul-Sep)
- Q2 (Oct-Dec)
- Q3 (Jan-Mar)
- Q4 (Apr-Jun)

### Tax Optimization Tips
Priority-ranked suggestions to save money:
- 🔴 HIGH priority tips (biggest savings)
- 🔵 MEDIUM priority tips
- Each shows potential dollar savings

### Document Checklist
9 checkboxes for tax documents:
- ✅ Check them off as you collect documents
- ✅ Your progress saves automatically

---

## Key Features

### 🔄 Auto-Fill
All fields automatically populate from your transaction data. No manual entry needed!

### 🧮 Calculator
Want to test scenarios?
1. Scroll to "Tax Calculator"
2. Change income or deductions
3. Click "Calculate"
4. See instant results

### 💡 Smart Tips
The system analyzes your income and provides personalized tax-saving strategies:
- If you're in a high bracket → suggests salary sacrificing
- If you have Airbnb income → reminds you about all deductions
- If you earn over $90K → warns about Medicare Levy Surcharge
- And more!

### 📥 Export
Click "Export Tax Report" (top right) to download all your tax data as JSON.

---

## Example Tax Calculation

Based on your data (from `financial_overview.json`):

```
Gross Income:           $70,966
  ├─ Salary:           $58,892
  ├─ Airbnb:              $795
  └─ Other:            $11,279

Less Deductions:       -$29,013
  └─ Airbnb Expenses:  $29,013

Taxable Income:         $41,953
  
Income Tax:            ~$4,511  (19% bracket)
Medicare Levy:           ~$839  (2%)
─────────────────────────────
Total Tax:             ~$5,350

Quarterly PAYG:        ~$1,338 per quarter
```

---

## Pro Tips

### 1. Check Optimization Tips First
The system will show you the **biggest opportunities to save tax**. These are personalized to your situation!

### 2. Use the Calculator for Planning
Test scenarios like:
- "What if I earn a bonus this year?"
- "How much tax would I save with more super contributions?"
- "What if my Airbnb income increases?"

### 3. Track Your Documents
Don't wait until June 30! Use the checklist to track documents as you receive them throughout the year.

### 4. Review Quarterly
Look at your quarterly PAYG estimates to avoid surprise tax bills. Plan your cash flow accordingly.

### 5. Export Before Meeting Accountant
Click "Export Tax Report" and send the file to your accountant. It has everything they need.

---

## Tax Brackets Quick Reference

**2024-25 Australian Tax Rates:**
- $0 - $18,200: **0%** (tax-free)
- $18,201 - $45,000: **19%**
- $45,001 - $120,000: **32.5%**
- $120,001 - $180,000: **37%**
- $180,001+: **45%**

Plus **2% Medicare Levy** on taxable income

---

## Troubleshooting

### If data looks wrong:
1. Check that your `financial_overview.json` has a `tax_data` section
2. Click the "🔄 Calculate Tax" button to refresh
3. Data updates automatically when you switch tabs

### To reset the document checklist:
The checklist saves to your browser's localStorage. To reset:
1. Open browser console (F12)
2. Type: `localStorage.clear()`
3. Refresh the page

### Calculator not showing results:
Make sure you:
1. Enter both income and deductions
2. Click the "Calculate" button
3. Check browser console for errors (F12)

---

## What's Auto-Filled

When you open Tax Hub, these fields populate automatically:
- ✅ Gross Income (from transactions)
- ✅ Salary Income (detected automatically)
- ✅ Airbnb Income (tracked separately)
- ✅ Other Income (dividends, interest, etc.)
- ✅ Tax Deductions (Airbnb expenses)
- ✅ Taxable Income (calculated)
- ✅ Tax Payable (using 2024-25 brackets)
- ✅ Quarterly PAYG (divided by 4)
- ✅ Optimization Tips (based on your bracket)

**Zero manual data entry required!** 🎉

---

## Questions?

The Tax Hub uses **official ATO 2024-25 tax brackets** and calculations. However:

⚠️ **This is for planning purposes only**
- Always consult a qualified accountant for tax advice
- Individual circumstances vary
- Tax laws change
- Capital gains, HELP, and other factors not included

Use this tool to:
✅ Estimate tax liability
✅ Plan quarterly payments
✅ Identify savings opportunities
✅ Track tax preparation
✅ Test scenarios

But get professional advice for your actual tax return!

---

**Ready to optimize your tax? Open the Tax Hub now! 💰**
