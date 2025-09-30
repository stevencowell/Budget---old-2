# Clickable Categories Feature

## Overview
Added interactive functionality to the "Where the money goes" section, allowing users to click on category bars to view detailed transaction breakdowns.

## What Was Changed

### 1. JavaScript Updates (`web/main.js`)

#### Modified `renderCategoryBars()` function:
- Added `allTransactions` parameter to receive transaction data
- Added `data-category` attribute to each bar item
- Added `cursor: pointer` style to indicate clickability
- Added click event listeners to each category bar
- Added hover effect for better UX

#### New `showCategoryTransactionDetails()` function:
- Creates a modal popup when a category is clicked
- Displays summary statistics for the selected category:
  - Total Income
  - Total Expenses
  - Net position
  - Transaction count
- Shows a detailed transaction table with:
  - Date (formatted in Australian format)
  - Description
  - Subcategory
  - Amount (color-coded: negative for expenses, positive for income)
- Transactions are sorted by date (most recent first)
- Modal can be closed by:
  - Clicking the X button
  - Clicking outside the modal (on overlay)
  - Pressing the Escape key
- Prevents body scroll while modal is open

#### Updated `init()` function:
- Modified the call to `renderCategoryBars()` to pass `data.recent_transactions`

### 2. CSS Updates (`web/styles.css`)

Added comprehensive modal styling:
- **Modal Container**: Fixed positioning, centered, with padding
- **Overlay**: Semi-transparent dark background with blur effect
- **Modal Content**: 
  - Card-style design matching the app's aesthetic
  - Responsive width (max 1000px)
  - Max height 85vh with scrolling
  - Dark theme with accent colors
- **Modal Header**: 
  - Gradient background
  - Close button with hover effects
- **Summary Stats Grid**: 
  - Responsive grid layout
  - Color-coded stat boxes (positive/negative values)
- **Transaction Table**: 
  - Scrollable list (max 400px)
  - Consistent styling with existing tables
- **Hover Effects**: 
  - Category bars highlight on hover
  - Smooth transitions

### 3. HTML Updates (`web/index.html`)

Updated the helper text:
- Changed from "Hover or tap to explore income and spending by theme."
- To "Click on any category to see detailed transactions and breakdown."

## User Experience

1. **Visual Feedback**: 
   - Category bars show a subtle background highlight on hover
   - Cursor changes to pointer to indicate clickability

2. **Modal Interaction**:
   - Smooth appearance with backdrop blur
   - Clear close button
   - Multiple ways to dismiss (X button, overlay click, Escape key)
   - Scroll prevention on body when modal is open

3. **Data Presentation**:
   - Summary statistics at the top for quick insights
   - Detailed transaction list below for deep dive
   - Color-coded amounts for easy identification
   - Australian date formatting for consistency

## Technical Details

- **Modal Management**: Uses vanilla JavaScript for modal creation and removal
- **Event Handling**: Proper cleanup of event listeners when modal is closed
- **Accessibility**: 
  - ARIA labels on close button
  - Keyboard support (Escape to close)
  - Semantic HTML structure
- **Performance**: Modal is created dynamically only when needed and removed when closed
- **Responsive Design**: Modal adapts to screen size with max-width constraints

## Testing

To test the feature:
1. Start the server: `./start_server.sh`
2. Open browser to `http://localhost:8000/web/`
3. Scroll to "Where the money goes" section
4. Click on any category bar (e.g., "Airbnb Property", "Groceries & Dining")
5. Verify the modal appears with correct data
6. Test closing mechanisms (X button, overlay click, Escape key)
7. Test on different screen sizes

## Future Enhancements

Possible improvements:
- Add filtering/sorting options in the modal
- Export transaction list for the selected category
- Add subcategory drill-down
- Show month-by-month breakdown for the category
- Add comparison with previous periods