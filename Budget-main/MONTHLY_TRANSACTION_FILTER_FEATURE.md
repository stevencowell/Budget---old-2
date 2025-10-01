# Monthly Transaction Filter Feature

## Overview
This feature allows users to click on monthly statements in the "Monthly cashflow trend" table and view all transactions for that specific month in the Transactions view.

## What Was Changed

### 1. Updated Cashflow Table (`renderCashflow` function)
- **Location**: `web/main.js` (lines 1244-1302)
- **Changes**:
  - Added a new "View Transactions" button next to the existing "View Details" button
  - The button stores the month string (format: `YYYY-MM`) in a `data-month-string` attribute
  - Added event handler to detect clicks on the "View Transactions" button
  - When clicked, the handler:
    1. Navigates to the Transactions view
    2. Applies the month filter using the new global function

### 2. Enhanced Transaction Filtering (`renderTransactions` function)
- **Location**: `web/main.js` (lines 1637-1651)
- **Changes**:
  - Exposed a new global function `window.applyMonthFilterToTransactions(monthString)`
  - This function:
    1. Accepts a month string in `YYYY-MM` format
    2. Calculates the first and last day of that month
    3. Updates the date filter inputs (dateFrom and dateTo)
    4. Applies the filter to the transaction list
    5. Resets to page 1 of results

## How It Works

### User Flow
1. User views the "Monthly cashflow trend" table in the Monthly Statements view
2. Each row now shows two buttons:
   - **View Details**: Opens the monthly statement details (existing functionality)
   - **View Transactions**: Filters transactions for that month (new functionality)
3. When clicking "View Transactions":
   - The app navigates to the Transactions view
   - Date filters are automatically set to the selected month
   - Only transactions from that month are displayed

### Technical Flow
```
User clicks "View Transactions" button
  ↓
Event handler captures the month string (e.g., "2024-11")
  ↓
Navigate to Transactions view
  ↓
Call window.applyMonthFilterToTransactions("2024-11")
  ↓
Calculate first day: "2024-11-01"
Calculate last day: "2024-11-30"
  ↓
Update date filter inputs with these values
  ↓
Trigger filter refresh to show only November 2024 transactions
```

## Example
If a user clicks "View Transactions" for November 2024:
- The Transactions view will show only transactions from November 1, 2024 to November 30, 2024
- The date filter inputs will be pre-populated with these dates
- The user can further refine the filter by category, type, or search term
- The user can clear the filter to see all transactions again

## Benefits
1. **Quick Access**: Users can immediately see all transactions for a specific month
2. **Context Aware**: Directly connects monthly summaries to detailed transaction data
3. **Flexible**: Users can further filter the results or clear filters as needed
4. **Consistent**: Uses existing filter mechanism, no new UI components needed

## Files Modified
- `web/main.js`:
  - `renderCashflow()` function (lines 1244-1302)
  - `renderTransactions()` function (lines 1607-1813)

## CSS Compatibility
The implementation uses the existing `.table-actions` CSS class, which already provides proper styling for multiple buttons in a table cell.

## Testing
To test the feature:
1. Open the application
2. Navigate to "Monthly Statements" view
3. Scroll down to the "Monthly cashflow trend" table
4. Click "View Transactions" button for any month
5. Verify that:
   - The Transactions view opens
   - Only transactions from the selected month are shown
   - The date filter inputs show the correct date range
   - The transaction count and total reflect only that month's data
