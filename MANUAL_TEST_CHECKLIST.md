# Manual Test Checklist - Budget Transaction View Feature

## Pre-Test Setup
- [ ] Open the application in a web browser
- [ ] Ensure data is loaded (financial_overview.json)
- [ ] Verify Budget Manager tab is accessible

## Test 1: Basic Click Functionality

### Steps:
1. [ ] Navigate to "Budget Manager" tab
2. [ ] Locate the "Groceries & Dining" → "Groceries" row
3. [ ] Click on the row
4. [ ] Verify you're automatically navigated to "Transactions" view
5. [ ] Verify the category filter shows "Groceries & Dining"
6. [ ] Verify the search box contains "Groceries"
7. [ ] Verify transactions are displayed

### Expected Results:
- ✅ Smooth transition to Transactions view
- ✅ Category filter is pre-selected
- ✅ Search filter is pre-filled
- ✅ Only relevant transactions are shown
- ✅ Transaction count is displayed

## Test 2: Hover Effects

### Steps:
1. [ ] Navigate to "Budget Manager" tab
2. [ ] Hover over any budget row (do NOT click)
3. [ ] Observe the visual changes

### Expected Results:
- ✅ Row background highlights in blue
- ✅ Cursor changes to pointer
- ✅ Magnifying glass icon (🔍) appears next to "Actual" amount
- ✅ Tooltip "Click to view transactions" is visible

## Test 3: Action Buttons Independence

### Steps:
1. [ ] Navigate to "Budget Manager" tab
2. [ ] Click the "Edit" button on any row
3. [ ] Verify the edit dialog appears (NOT the transactions view)
4. [ ] Cancel the edit
5. [ ] Click the "Duplicate" button on any row
6. [ ] Verify duplication occurs (NOT navigation to transactions)
7. [ ] Click the "Delete" button on any row
8. [ ] Verify delete confirmation appears (NOT transactions view)
9. [ ] Cancel the delete

### Expected Results:
- ✅ Edit button opens edit dialog
- ✅ Duplicate button creates a copy
- ✅ Delete button shows confirmation
- ✅ No navigation to transactions view when clicking action buttons

## Test 4: Multiple Budget Items

### Test with these specific items:
1. [ ] Click "Housing & Utilities" → "Water"
   - Expected: Shows water transactions
2. [ ] Go back to Budget Manager
3. [ ] Click "Housing & Utilities" → "Gas/Electricity"
   - Expected: Shows gas/electricity transactions
4. [ ] Go back to Budget Manager
5. [ ] Click "Transportation" → "Fuel"
   - Expected: Shows fuel transactions

### Expected Results:
- ✅ Each click shows different transactions
- ✅ Filters update correctly each time
- ✅ Previous filters are cleared before applying new ones

## Test 5: Income Items

### Steps:
1. [ ] Navigate to "Budget Manager" tab
2. [ ] Find "Miscellaneous" → "Income" row
3. [ ] Click on the row
4. [ ] Verify navigation to Transactions view
5. [ ] Check if income transactions are shown

### Expected Results:
- ✅ Navigates to transactions view
- ✅ Category filter shows "Miscellaneous"
- ✅ Search filter shows "Income"
- ✅ Income transactions are visible (if any exist)

## Test 6: Items with No Transactions

### Steps:
1. [ ] Navigate to "Budget Manager" tab
2. [ ] Find a budget item with "—" in the Actual column
3. [ ] Click on the row
4. [ ] Verify navigation to Transactions view

### Expected Results:
- ✅ Navigates to transactions view
- ✅ Filters are applied
- ✅ Shows "No transactions match your filters" message
- ✅ No errors in console

## Test 7: Filter Persistence

### Steps:
1. [ ] Navigate to "Transactions" view directly
2. [ ] Apply some filters manually (category, date range, search)
3. [ ] Go to "Budget Manager" tab
4. [ ] Click on any budget row
5. [ ] Return to Transactions view

### Expected Results:
- ✅ Old filters are cleared
- ✅ New filters from budget item are applied
- ✅ No filter conflicts
- ✅ Clean transition

## Test 8: Clear Filters After Budget Click

### Steps:
1. [ ] Navigate to "Budget Manager" tab
2. [ ] Click on "Groceries & Dining" → "Groceries"
3. [ ] In Transactions view, verify filters are applied
4. [ ] Click "Clear Filters" button
5. [ ] Verify all transactions are shown

### Expected Results:
- ✅ Clear Filters button works
- ✅ All transactions are displayed after clearing
- ✅ Filters are reset to defaults
- ✅ Can browse all transactions freely

## Test 9: Browser Console Check

### Steps:
1. [ ] Open browser developer tools (F12)
2. [ ] Navigate to Console tab
3. [ ] Clear any existing logs
4. [ ] Navigate to "Budget Manager" tab
5. [ ] Click on several budget rows
6. [ ] Check console for errors

### Expected Results:
- ✅ No JavaScript errors
- ✅ No warnings related to the feature
- ✅ No 404 errors or missing resources
- ✅ `window.applyBudgetItemFilter` function is defined

## Test 10: Responsive Design

### Steps:
1. [ ] Resize browser window to mobile size (375px width)
2. [ ] Navigate to "Budget Manager" tab
3. [ ] Verify table is scrollable
4. [ ] Click on a budget row
5. [ ] Verify navigation works on mobile

### Expected Results:
- ✅ Table is scrollable horizontally
- ✅ Click functionality works on mobile
- ✅ Hover effects work (or tap effects on touch)
- ✅ Transactions view is accessible

## Test 11: Performance

### Steps:
1. [ ] Navigate to "Budget Manager" tab
2. [ ] Click rapidly on different budget rows (5-10 times)
3. [ ] Observe response time and behavior

### Expected Results:
- ✅ No lag or freezing
- ✅ Each click is processed correctly
- ✅ No duplicate navigations
- ✅ Filters update correctly each time

## Test 12: Edge Cases

### Test these scenarios:
1. [ ] Click on budget row with special characters in name
2. [ ] Click on budget row with very long name
3. [ ] Click on budget row with numbers in name
4. [ ] Click on budget row with empty/null actual value

### Expected Results:
- ✅ All cases work without errors
- ✅ Filters handle special characters correctly
- ✅ No breaking or visual issues
- ✅ Graceful handling of edge cases

## Browser Compatibility Tests

Test in the following browsers:

### Chrome/Chromium
- [ ] All tests pass
- [ ] Visual effects work correctly
- [ ] No console errors

### Firefox
- [ ] All tests pass
- [ ] Visual effects work correctly
- [ ] No console errors

### Safari
- [ ] All tests pass
- [ ] Visual effects work correctly
- [ ] No console errors

### Edge
- [ ] All tests pass
- [ ] Visual effects work correctly
- [ ] No console errors

## Accessibility Tests

### Keyboard Navigation:
1. [ ] Tab through budget table rows
2. [ ] Press Enter on a focused row
3. [ ] Verify navigation occurs

### Screen Reader:
1. [ ] Use screen reader (if available)
2. [ ] Navigate to budget table
3. [ ] Verify row information is announced
4. [ ] Verify click action is announced

### Expected Results:
- ✅ Keyboard navigation works
- ✅ Screen reader announces content
- ✅ Accessible to all users

## Final Checks

### Code Quality:
- [ ] No linter errors in main.js
- [ ] No linter errors in styles.css
- [ ] No linter errors in index.html
- [ ] Code follows project conventions

### Documentation:
- [ ] BUDGET_TRANSACTION_VIEW_FEATURE.md is complete
- [ ] HOW_TO_VIEW_BUDGET_TRANSACTIONS.md is complete
- [ ] User-facing helper text is clear
- [ ] Code comments are adequate

### User Experience:
- [ ] Feature is intuitive
- [ ] Visual feedback is clear
- [ ] No confusing behavior
- [ ] Smooth transitions

## Test Results Summary

**Date Tested:** _______________
**Tested By:** _______________
**Browser/Version:** _______________
**Operating System:** _______________

**Overall Result:** ☐ PASS ☐ FAIL

**Issues Found:**
1. ___________________________________
2. ___________________________________
3. ___________________________________

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

## Sign-Off

**Tester Signature:** _______________
**Date:** _______________

---

**IMPORTANT:** If any test fails, document the issue and fix before deployment. This feature should provide a seamless experience for users tracking their budget.
