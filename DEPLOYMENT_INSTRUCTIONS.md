# GitHub Pages Deployment Instructions

This document explains how to deploy the Superannuation Tracker application to GitHub Pages.

## Overview

The application consists of two parts:
1. **Main Budget App** - Static HTML/CSS/JS application (index.html)
2. **Superannuation Tracker** - React application (in the `client/` folder)

Both are deployed together to GitHub Pages.

## Repository Setup

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: Select **GitHub Actions**
   - (Do NOT select "Deploy from a branch")

### 2. Verify Workflow Permissions

1. In repository **Settings** → **Actions** → **General**
2. Scroll to "Workflow permissions"
3. Select **"Read and write permissions"**
4. Check **"Allow GitHub Actions to create and approve pull requests"**
5. Click **Save**

## Deployment Process

The deployment happens automatically via GitHub Actions when you push to the `main` branch.

### Automatic Deployment

1. Push changes to the `main` branch:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```

2. The GitHub Action will:
   - Install dependencies for both main app and React client
   - Build the React app
   - Package everything into a deployment folder
   - Deploy to GitHub Pages

3. Monitor the deployment:
   - Go to the **Actions** tab in your repository
   - Click on the latest workflow run
   - Wait for both "build" and "deploy" jobs to complete (green checkmarks)

### Manual Deployment Trigger

You can also trigger a deployment manually:

1. Go to **Actions** tab
2. Click on **"Deploy to GitHub Pages"** workflow
3. Click **"Run workflow"** dropdown
4. Select branch (usually `main`)
5. Click **"Run workflow"** button

## Accessing the Application

After successful deployment, your applications will be available at:

- **Main Budget App**: `https://<username>.github.io/superannuation/`
- **Superannuation Tracker**: `https://<username>.github.io/superannuation/app/`

Replace `<username>` with your GitHub username (e.g., `stevencowell.github.io/superannuation/`)

## File Structure

```
/workspace/
├── index.html              # Main budget app
├── styles.css              # Styles for main app
├── main.js                 # JavaScript for main app
├── data/                   # Financial data
│   └── financial_overview.json
├── client/                 # React superannuation app
│   ├── public/
│   ├── src/
│   └── package.json
└── .github/
    └── workflows/
        └── deploy.yml      # Deployment workflow
```

## Troubleshooting

### 404 Error on /superannuation

**Problem**: Getting 404 when accessing the site

**Solutions**:
1. Verify GitHub Pages is enabled in Settings → Pages
2. Check that workflow completed successfully in Actions tab
3. Ensure you selected "GitHub Actions" as the source (not "Deploy from a branch")
4. Wait 2-5 minutes after deployment completes for DNS propagation

### 404 Error on /superannuation/app

**Problem**: Main page works but clicking Superannuation button gives 404

**Solutions**:
1. Check the Actions tab to ensure the build completed successfully
2. Verify the `client/build` folder was created during the build
3. Check the build logs for any React build errors

### Workflow Fails

**Problem**: GitHub Actions workflow fails

**Solutions**:
1. Check workflow permissions in Settings → Actions → General
2. Review the error logs in the Actions tab
3. Ensure all dependencies are listed in package.json files
4. Check that Node version 18 is compatible with your dependencies

### React App Shows Blank Page

**Problem**: /superannuation/app loads but shows blank screen

**Solutions**:
1. Check browser console for errors (F12)
2. Verify `homepage` field in `client/package.json` is set to `/superannuation/app`
3. Check that `PUBLIC_URL` environment variable is set correctly in workflow
4. Ensure all asset paths in React app are relative

## Making Changes

### Update Main Budget App

1. Edit `index.html`, `styles.css`, or `main.js`
2. Commit and push changes
3. Wait for automatic deployment

### Update React Superannuation App

1. Navigate to `client/` folder
2. Make changes to React components in `src/`
3. Test locally: `cd client && npm start`
4. Commit and push changes
5. Wait for automatic deployment

## Local Development

### Main App
Simply open `index.html` in a browser or use a local server:
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### React App
```bash
cd client
npm install
npm start
# Runs on http://localhost:3000
```

## Additional Notes

- First deployment may take 5-10 minutes
- Subsequent deployments are faster (2-3 minutes)
- The workflow only runs on pushes to `main` branch
- You can modify the workflow to deploy from other branches by editing `.github/workflows/deploy.yml`
