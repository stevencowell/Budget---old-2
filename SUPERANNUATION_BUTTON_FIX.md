# Superannuation Button Fix

## Issue
The Superannuation Tracker button was causing the page to flick back to the overview instead of opening the superannuation app in a new window.

## Root Cause
The superannuation button has the class `.nav-btn` which caused it to be processed by the general navigation event handler. Even though the handler had a check to skip buttons without a `data-view` attribute, the event was still propagating and potentially interfering with the navigation state.

## Solution
Added `e.stopPropagation()` to the superannuation button's click handler to prevent event bubbling that could interfere with the navigation system.

### Changes Made to `/workspace/main.js`

**Before:**
```javascript
const superBtn = document.getElementById('superannuationAppBtn');
if (superBtn) {
  superBtn.addEventListener('click', () => {
    // Open the React superannuation app
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const superAppUrl = isLocal ? 'http://localhost:3000' : 'https://stevencowell.github.io/Budget---old-2/app/';
    window.open(superAppUrl, '_blank');
  });
}
```

**After:**
```javascript
const superBtn = document.getElementById('superannuationAppBtn');
if (superBtn) {
  superBtn.addEventListener('click', (e) => {
    // Prevent the default nav-btn behavior
    e.stopPropagation();
    
    // Open the React superannuation app
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const superAppUrl = isLocal ? 'http://localhost:3000' : 'https://stevencowell.github.io/Budget---old-2/app/';
    window.open(superAppUrl, '_blank');
  });
}
```

## How It Works Now

1. User clicks the "🏦 Superannuation Tracker" button
2. The superannuation-specific event handler fires first
3. `e.stopPropagation()` prevents the event from bubbling up
4. The general navigation handler doesn't process this button
5. The React app opens in a new window/tab
6. The current page stays on whatever view was active

## Testing

### Local Development
1. Start the React app: `npm run client` (runs on http://localhost:3000)
2. Open the main Budget app in a browser
3. Click "🏦 Superannuation Tracker"
4. The React app should open in a new tab at localhost:3000

### Production
1. Visit the deployed Budget app
2. Click "🏦 Superannuation Tracker"  
3. The React app should open in a new tab at https://stevencowell.github.io/Budget---old-2/app/

## Related Files
- `/workspace/index.html` - Contains the button markup (line 33)
- `/workspace/main.js` - Contains the navigation logic (lines 116-150)
- `/workspace/styles.css` - Contains button styling (lines 94-102)
- `/workspace/SUPERANNUATION_ACCESS.md` - Documentation on how to access the app
