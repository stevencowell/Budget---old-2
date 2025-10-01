# Accessing the Superannuation Tracker App

## Overview
The workspace now contains **two applications**:

1. **Budget Command Centre** - The main family budget management app (root directory)
2. **Superannuation Tracker** - A dedicated React app for retirement planning (`/client/` directory)

## How to Access the Superannuation App

### Option 1: Via the Navigation Button (Recommended)
1. Open the Budget Command Centre app (main `index.html`)
2. Look for the **"🏦 Superannuation Tracker"** button in the navigation bar
3. Click the button to open the Superannuation Tracker in a new window/tab

### Option 2: Direct Access
You can also run the Superannuation Tracker directly:

#### Development Mode
```bash
# Terminal 1: Start the backend server (from root directory)
npm start
# Or for auto-restart on changes:
npm run dev

# Terminal 2: Start the React frontend
npm run client
```

The apps will run on:
- Budget App: `http://localhost:5000` (or whichever port you're using)
- Superannuation App: `http://localhost:3000`

#### Production Mode
```bash
# Build the client
npm run client-build

# Start the server
npm start
```

## What Changed
- **Added** a new navigation button "🏦 Superannuation Tracker" to the main Budget app
- **Added** JavaScript handler to open the React app in a new window
- **Added** special styling (purple theme) to make the button stand out
- The button intelligently detects if you're in development (opens `localhost:3000`) or production mode

## Features of the Superannuation Tracker
- 📊 Dashboard with personal details and current balance
- 📈 Projection Calculator with compound growth visualization
- 💰 Retirement Income Calculator with withdrawal strategies
- 🧾 Tax Benefits Calculator for concessional contributions
- 📉 Minimum Drawdown Calculator with age-based requirements

## Troubleshooting

### "Can't connect to localhost:3000"
Make sure the React app is running:
```bash
cd client
npm install  # if not already done
npm start
```

### Button doesn't appear
1. Clear your browser cache
2. Make sure you're viewing the main Budget app (`index.html` in root)
3. Check browser console for JavaScript errors

### React app won't start
Make sure dependencies are installed:
```bash
npm run install-all
```

Or manually:
```bash
cd client
npm install
```
