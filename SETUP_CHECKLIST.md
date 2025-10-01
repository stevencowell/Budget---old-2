# GitHub Pages Setup Checklist

## ✅ Quick Setup (5 minutes)

### Step 1: Enable GitHub Pages
- [ ] Go to https://github.com/stevencowell/superannuation/settings/pages
- [ ] Under "Build and deployment"
- [ ] Change "Source" dropdown to **"GitHub Actions"**
- [ ] Click Save (if there's a save button)

### Step 2: Push the Changes
```bash
git add .
git commit -m "Enable GitHub Pages deployment"
git push origin main
```

### Step 3: Wait for Deployment
- [ ] Go to https://github.com/stevencowell/superannuation/actions
- [ ] Wait for the workflow to complete (green checkmark)
- [ ] Usually takes 3-5 minutes

### Step 4: Test It
- [ ] Visit: https://stevencowell.github.io/superannuation/
- [ ] Click the "🏦 Superannuation Tracker" button
- [ ] Should open the app in a new tab
- [ ] No more 404 error! 🎉

---

## 🔍 If Something Goes Wrong

### Still Getting 404?
- Wait 2-3 more minutes (DNS propagation)
- Try hard refresh: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac)
- Check Actions tab for any red X marks (failed builds)

### Workflow Failed?
1. Click on the failed workflow in Actions tab
2. Look at the error message
3. Common issues:
   - Node dependencies: Run `npm install` in both root and `client/` folders
   - Permissions: Check Settings → Actions → General → Workflow permissions

### Need Help?
Check `DEPLOYMENT_INSTRUCTIONS.md` for detailed troubleshooting

---

## 📋 Files Changed

You'll be committing:
- ✅ `.github/workflows/deploy.yml` (new)
- ✅ `client/package.json` (modified - added homepage)
- ✅ `main.js` (modified - updated URL)
- 📄 Documentation files (optional, but helpful)

---

## 🎯 Expected Result

**Before:** 
- Button click → 404 error

**After:** 
- Button click → Opens superannuation tracker app
- Main app: https://stevencowell.github.io/superannuation/
- React app: https://stevencowell.github.io/superannuation/app/

Both apps fully functional on GitHub Pages! 🚀
