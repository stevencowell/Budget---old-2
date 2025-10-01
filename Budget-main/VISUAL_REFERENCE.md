# Visual Reference: Monthly Transaction Filter Feature

## Overview
This document shows the visual changes made to implement the monthly transaction filter feature.

---

## 1. Monthly Cashflow Table - BEFORE

```
┌──────────────┬────────────┬────────────┬────────────┬──────────────┬─────────────────┐
│ MONTH        │ INCOME     │ EXPENSES   │ NET        │ SAVINGS RATE │ ACTIONS         │
├──────────────┼────────────┼────────────┼────────────┼──────────────┼─────────────────┤
│ Sept 2024    │ $0.00      │ $727.34    │ -$727.34   │ 0.0%         │ [View Details]  │
│ Oct 2024     │ $15,679.62 │ $22,079.18 │ -$6,399.56 │ -40.8%       │ [View Details]  │
│ Nov 2024     │ $44,227.91 │ $41,099.38 │ $3,128.53  │ 7.1%         │ [View Details]  │
│ Dec 2024     │ $28,618.19 │ $25,972.48 │ $2,645.71  │ 9.2%         │ [View Details]  │
└──────────────┴────────────┴────────────┴────────────┴──────────────┴─────────────────┘
```

**Note:** Only one action button per row

---

## 2. Monthly Cashflow Table - AFTER

```
┌──────────────┬────────────┬────────────┬────────────┬──────────────┬──────────────────────────────┐
│ MONTH        │ INCOME     │ EXPENSES   │ NET        │ SAVINGS RATE │ ACTIONS                      │
├──────────────┼────────────┼────────────┼────────────┼──────────────┼──────────────────────────────┤
│ Sept 2024    │ $0.00      │ $727.34    │ -$727.34   │ 0.0%         │ [View Details]               │
│              │            │            │            │              │ [View Transactions] ⭐ NEW   │
├──────────────┼────────────┼────────────┼────────────┼──────────────┼──────────────────────────────┤
│ Oct 2024     │ $15,679.62 │ $22,079.18 │ -$6,399.56 │ -40.8%       │ [View Details]               │
│              │            │            │            │              │ [View Transactions] ⭐ NEW   │
├──────────────┼────────────┼────────────┼────────────┼──────────────┼──────────────────────────────┤
│ Nov 2024     │ $44,227.91 │ $41,099.38 │ $3,128.53  │ 7.1%         │ [View Details]               │
│              │            │            │            │              │ [View Transactions] ⭐ NEW   │
├──────────────┼────────────┼────────────┼────────────┼──────────────┼──────────────────────────────┤
│ Dec 2024     │ $28,618.19 │ $25,972.48 │ $2,645.71  │ 9.2%         │ [View Details]               │
│              │            │            │            │              │ [View Transactions] ⭐ NEW   │
└──────────────┴────────────┴────────────┴────────────┴──────────────┴──────────────────────────────┘
```

**Note:** Two action buttons per row now

---

## 3. User Interaction Flow

### Scenario: User wants to see all November 2024 transactions

```
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 1: User views Monthly Statements                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                     │
│  Monthly cashflow trend table shows:                               │
│  Nov 2024: Income $44,227.91, Expenses $41,099.38, Net $3,128.53  │
│                                                                     │
│  User sees two buttons:                                            │
│  • [View Details] ← Shows monthly summary                          │
│  • [View Transactions] ← NEW! Shows individual transactions        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
                          User clicks [View Transactions]
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 2: App navigates to Transactions view                         │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                     │
│  Automatically happens (100ms transition):                         │
│  ✓ Switch to Transactions tab                                      │
│  ✓ Apply month filter (Nov 1 - Nov 30, 2024)                      │
│  ✓ Update date inputs                                              │
│  ✓ Refresh transaction list                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│ STEP 3: User sees filtered transactions                            │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                                     │
│  Transaction Explorer                                              │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │ Search: [___________]  Category: [All categories ▼]        │  │
│  │ Type: [All types ▼]  From: [2024-11-01]  To: [2024-11-30] │  │
│  │                                   ↑             ↑           │  │
│  │                        Pre-filled dates for November       │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Showing: 145 transactions  |  Total: $44,227.91                  │
│             ↑                        ↑                              │
│      Only Nov transactions    Only Nov total                       │
│                                                                     │
│  ┌──────┬─────────────────────┬──────────────┬─────────┬──────┐  │
│  │ Date │ Description         │ Category     │ Amount  │ ...  │  │
│  ├──────┼─────────────────────┼──────────────┼─────────┼──────┤  │
│  │ 11/1 │ Woolworths Sydney   │ Groceries    │ -$150   │ ...  │  │
│  │ 11/2 │ Salary - Steve      │ Income       │ +$5,000 │ ...  │  │
│  │ 11/5 │ Netflix             │ Entertainment│ -$25    │ ...  │  │
│  │ ...  │ ...                 │ ...          │ ...     │ ...  │  │
│  └──────┴─────────────────────┴──────────────┴─────────┴──────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Code Structure

### HTML Structure (Generated)

```html
<!-- Monthly Cashflow Table Row (BEFORE) -->
<tr>
  <td>Nov 2024</td>
  <td>$44,227.91</td>
  <td>$41,099.38</td>
  <td class="variance-positive">$3,128.53</td>
  <td>7.1%</td>
  <td>
    <button class="table-action-btn" data-action="view-month" data-month="2">
      View Details
    </button>
  </td>
</tr>

<!-- Monthly Cashflow Table Row (AFTER) -->
<tr>
  <td>Nov 2024</td>
  <td>$44,227.91</td>
  <td>$41,099.38</td>
  <td class="variance-positive">$3,128.53</td>
  <td>7.1%</td>
  <td>
    <div class="table-actions">  ⬅️ Wrapped in container
      <button class="table-action-btn" data-action="view-month" data-month="2">
        View Details
      </button>
      <button class="table-action-btn" data-action="view-transactions" data-month-string="2024-11">
        View Transactions  ⬅️ NEW BUTTON
      </button>
    </div>
  </td>
</tr>
```

### JavaScript Flow

```javascript
// STEP 1: User clicks button
tbody.addEventListener('click', (e) => {
  const viewTransactionsBtn = e.target.closest('[data-action="view-transactions"]');
  
  if (viewTransactionsBtn) {
    const monthString = viewTransactionsBtn.dataset.monthString; // "2024-11"
    
    // STEP 2: Navigate to Transactions view
    document.querySelector('.nav-btn[data-view="transactions"]').click();
    
    // STEP 3: Apply filter (after view loads)
    setTimeout(() => {
      window.applyMonthFilterToTransactions(monthString);
    }, 100);
  }
});

// STEP 4: Filter function applies the date range
window.applyMonthFilterToTransactions = (monthString) => {
  // "2024-11" → "2024-11-01" to "2024-11-30"
  const year = monthString.substring(0, 4);
  const month = monthString.substring(5, 7);
  const firstDay = `${year}-${month}-01`;
  const lastDay = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
  
  // Update filter state and inputs
  state.filters.dateFrom = firstDay;
  state.filters.dateTo = lastDay;
  dateFromInput.value = firstDay;
  dateToInput.value = lastDay;
  state.currentPage = 1;
  
  // Refresh display
  draw();
};
```

---

## 5. Date Calculation Examples

### How Last Day Calculation Works

```javascript
// JavaScript Date constructor: new Date(year, monthIndex, day)
// monthIndex is 0-based (0 = January, 11 = December)
// Using day = 0 gives the last day of the PREVIOUS month

// Example 1: November 2024 (30 days)
const monthString = "2024-11";
const year = 2024;
const month = 11;
new Date(2024, 11, 0)  // → November 30, 2024
// Explanation: Month 11 (December), day 0 → last day of month 10 (November)

// Example 2: February 2024 (leap year, 29 days)
const monthString = "2024-02";
const year = 2024;
const month = 2;
new Date(2024, 2, 0)  // → February 29, 2024
// Explanation: Month 2 (March), day 0 → last day of month 1 (February)

// Example 3: February 2025 (non-leap year, 28 days)
const monthString = "2025-02";
const year = 2025;
const month = 2;
new Date(2025, 2, 0)  // → February 28, 2025
```

---

## 6. CSS Styling

The feature uses the existing `.table-actions` CSS class:

```css
.table-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  flex-wrap: wrap;
}
```

This ensures:
- Buttons are displayed horizontally with 0.5rem gap
- Buttons align to the right (consistent with other action columns)
- Buttons wrap to new line on small screens (responsive)

---

## 7. Mobile Responsiveness

On smaller screens, the buttons stack vertically:

```
Desktop (>768px):
┌───────────────────────────────┐
│ [View Details] [View Txns]    │
└───────────────────────────────┘

Mobile (<768px):
┌───────────────────────────────┐
│ [View Details]                │
│ [View Transactions]           │
└───────────────────────────────┘
```

---

## 8. Summary

**What Changed:**
- ✅ Added one button per row in the cashflow table
- ✅ Added one global function for filtering
- ✅ Added event handler for button clicks
- ✅ ~40 lines of code total

**What Stayed the Same:**
- ✅ Existing "View Details" button works as before
- ✅ Transactions view layout unchanged
- ✅ Filtering logic uses existing mechanism
- ✅ No new UI components or styles needed

**Result:**
Users can now click one button to instantly see all transactions for a specific month!
