# Clickable Anomaly Cards Feature

## Overview
The anomaly/flagged transaction cards in the AI Insights view are now **fully interactive and clickable**, allowing users to dive deeper into unusual spending patterns and understand the context behind flagged transactions.

## What's New

### 1. **Clickable Anomaly Cards**
All anomaly cards in the "Unusual Spending Patterns" section are now clickable. Each card displays:
- Priority badge (High/Medium)
- Transaction date
- Merchant/description
- Transaction amount
- Category and subcategory
- Reason for flagging
- Expected spending range
- **A visual prompt: "Click to see full details and related transactions"**

### 2. **Detailed Transaction Modal**
When you click on any anomaly card, a comprehensive modal window opens showing:

#### Transaction Details
- **Full anomaly information** - Priority, date, merchant, amount, category
- **Why it was flagged** - Detailed explanation with deviation percentage
- **Expected range** - What the typical spending looks like for this category

#### Statistical Comparison
Four key metrics displayed side-by-side:
- **This Transaction** - The flagged transaction amount
- **Category Average** - Average spending for this category/subcategory
- **Typical Range** - Min to max range of similar transactions
- **Related Transactions** - Number of comparable transactions found

#### Related Transactions Table
- Shows all transactions in the same category/subcategory within ±3 months
- Highlighted row for the flagged transaction (orange background with 👈 indicator)
- Sortable by date (most recent first)
- Color-coded amounts (negative = red, positive = green)

#### Actionable Insights
A "What to do next" section with recommendations:
- Verify the transaction is legitimate and not a duplicate
- Check if this is a one-time expense or a recurring pattern
- Consider if the category needs budget adjustment
- Review if the merchant needs recategorization

## User Experience Enhancements

### Visual Feedback
- **Hover effect**: Cards lift up and display enhanced shadow when hovered
- **Cursor change**: Pointer cursor indicates clickability
- **Smooth animations**: Transitions for all interactions
- **Active state**: Subtle press effect when clicking

### Modal Interactions
- **Click overlay** to close
- **Click X button** to close
- **Press Escape key** to close
- **Body scroll lock** while modal is open (prevents background scrolling)

## Technical Implementation

### Code Changes
1. **New function**: `showAnomalyDetailModal(anomaly, allTransactions)`
   - Creates and displays detailed modal for any anomaly
   - Fetches related transactions from same category/subcategory
   - Calculates statistical comparisons
   - Renders comprehensive transaction table

2. **Updated function**: `renderAnomalies(anomalies)`
   - Cards now include `data-anomaly-index` attribute
   - Added click event listeners to each card
   - Visual prompt added to card footer

3. **CSS enhancements**: 
   - `.clickable-card` hover and active states
   - Enhanced shadow effects
   - Transform animations

### Files Modified
- `/workspace/web/main.js` - Added modal function and click handlers (lines 3077-3229, 3231-3301)
- `/workspace/web/styles.css` - Added hover effects (lines 1296-1304)

## Usage Example

### Before
Users could only see basic information about flagged transactions on the cards themselves - no way to investigate further or see related spending.

### After
Users can:
1. Browse anomaly cards in the AI Insights view
2. Click any card that looks interesting
3. See comprehensive details including:
   - Statistical comparison with typical spending
   - All related transactions in the same category
   - Actionable recommendations
4. Close modal and continue browsing other anomalies

## Benefits

1. **Better Context**: Users can see how the flagged transaction compares to their typical spending
2. **Pattern Recognition**: Related transactions table helps identify if this is an anomaly or emerging pattern
3. **Informed Decisions**: Statistical data helps users decide if action is needed
4. **Time Savings**: No need to manually filter the transactions view to investigate
5. **Enhanced Trust**: Transparency in why transactions are flagged builds user confidence

## Related Features

This feature complements existing functionality:
- **Category bars** (Overview view) - Already clickable to show category details
- **Subscription analysis** (AI Insights) - Already has detailed modal views
- **Transaction explorer** - Full transaction filtering and search

## Future Enhancements

Potential improvements:
- Add "Mark as reviewed" button to dismiss anomalies
- Include month-over-month trend chart in modal
- Add quick action buttons (recategorize, split transaction, etc.)
- Export anomaly details to PDF/CSV
- Add notes/comments capability for future reference

---

**Status**: ✅ Implemented and tested  
**Version**: 1.0  
**Date**: September 30, 2025