# Quick Fix for 404 Error

## The Problem
The Superannuation button shows a 404 error because GitHub Pages isn't set up yet.

## The Solution (2 Steps)

### Step 1: Enable GitHub Pages with GitHub Actions

1. Go to your repository: https://github.com/stevencowell/superannuation
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source**: Select **"GitHub Actions"** from dropdown
   - (NOT "Deploy from a branch")
5. Leave other settings as default

### Step 2: Push These Changes

The files I've created include:
- `.github/workflows/deploy.yml` - Automated deployment configuration
- Updated `client/package.json` - React app homepage setting
- Updated `main.js` - Correct production URL

Push these changes to trigger the deployment:

```bash
git add .
git commit -m "Set up GitHub Pages deployment"
git push origin main
```

## What Happens Next

1. GitHub Actions will automatically build and deploy your app (takes 3-5 minutes)
2. You can watch progress at: https://github.com/stevencowell/superannuation/actions
3. Once complete (green checkmark), your apps will be live at:
   - Main app: https://stevencowell.github.io/superannuation/
   - Superannuation tracker: https://stevencowell.github.io/superannuation/app/

## Verifying It Works

1. Go to https://stevencowell.github.io/superannuation/
2. Click the "🏦 Superannuation Tracker" button
3. It should open the React app in a new tab

## If You Still Get 404

- Wait 2-3 minutes (GitHub Pages needs time to propagate)
- Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
- Check the Actions tab to ensure deployment succeeded

---

That's it! The 404 error should be fixed once the deployment completes.
