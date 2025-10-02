# Complete Backup & Restore Guide

## Overview

The Cowell Family Budget App now has a **comprehensive backup system** that exports and imports ALL your data, ensuring you never lose anything when clearing data or switching devices.

## What's Included in the Backup?

When you click "Export Data", the system creates a complete backup file containing:

### 1. **Budget Items** (`budget`)
- All your customized budget entries
- Modified amounts and categories
- Personal financial planning data

### 2. **Financial Scenarios** (`scenarios`)
- All your "what-if" scenarios
- Custom financial projections
- Saved comparison models

### 3. **Category Changes** (`categoryChanges`)
- Custom category assignments for transactions
- Manual recategorizations you've made
- Transaction-specific overrides

### 4. **Subcategory Rules** (`subcategoryRules`)
- AI-learned patterns (e.g., "Netflix → Subscriptions")
- Custom subcategory mappings
- Automated categorization rules

### 5. **Tax Checklists** (`taxChecklists`)
- Your progress on tax document checklists
- Checked/unchecked status for each item
- All tax-related tracking data

### 6. **Superannuation Data** (`superannuationData`)
- All data from the Superannuation Tracker
- Account balances and projections
- Super-specific settings and preferences

## How to Create a Complete Backup

### Step 1: Export Your Data
1. Click the **"Export Data"** button in the top header
2. The system will automatically collect all your data
3. A JSON file will be downloaded with a name like:
   ```
   cowell-budget-complete-backup-2025-10-02.json
   ```
4. You'll see a confirmation message listing what was exported

### Step 2: Save Your Backup File
1. Move the downloaded file to a safe location
2. Recommended locations:
   - Cloud storage (Google Drive, Dropbox, OneDrive)
   - External hard drive
   - Email it to yourself
3. Name it descriptively, e.g., `backup-before-clearing-2025-10-02.json`

## How to Restore Your Data

### From a Backup File
1. Click the **"Import Data"** button in the top header
2. Select your backup JSON file
3. The system will restore ALL data categories
4. You'll see a detailed message showing what was restored
5. The page will automatically reload with your data

### What Gets Restored
- ✅ All budget customizations
- ✅ All saved scenarios
- ✅ All category changes
- ✅ All subcategory rules
- ✅ All tax checklist progress
- ✅ All superannuation data

## Complete Workflow: Export → Clear → Import

### Before Clearing Data

1. **Export your data** using the "Export Data" button
2. **Verify the file downloaded** (check your Downloads folder)
3. **Save the file somewhere safe** (see Step 2 above)

### Clearing Data

4. Click the **"🗑️ Clear All Data"** button
5. Read the warnings carefully
6. Confirm twice (safety feature)
7. All localStorage data will be cleared
8. App reloads with fresh state

### After Clearing (To Restore)

9. Click the **"Import Data"** button
10. Select your backup file
11. All your data is restored
12. App reloads with everything back

## File Format

The backup file is a JSON file with this structure:

```json
{
  "budget": { /* budget items */ },
  "scenarios": [ /* scenarios array */ ],
  "categoryChanges": { /* category mappings */ },
  "subcategoryRules": [ /* rule array */ ],
  "taxChecklists": { 
    "tax_checklist_item1": "true",
    "tax_checklist_item2": "false"
  },
  "superannuationData": { 
    "superannuation_balance": 150000
  },
  "exportDate": "2025-10-02T10:30:00.000Z",
  "version": "1.0"
}
```

## Version Compatibility

- **Version 1.0**: Current version (comprehensive backup)
- **Legacy backups**: Old export files that only had `budget` and `scenarios` will still work, but won't restore other data types

## Safety Features

### During Export
- ✅ Automatic error handling for each data type
- ✅ Warns about export errors in console
- ✅ Still exports other data if one type fails
- ✅ Includes version number for compatibility

### During Import
- ✅ Validates JSON format before importing
- ✅ Shows detailed list of what was restored
- ✅ Handles missing data gracefully
- ✅ Resets file input after import
- ✅ Clear error messages if import fails

### During Clear
- ✅ Double confirmation required
- ✅ Shows count of items to be deleted
- ✅ Suggests exporting first
- ✅ Only clears app-specific data

## Common Scenarios

### Scenario 1: Sharing the App
**Goal**: Give someone a clean version of the app

1. Export your data first (backup)
2. Clear all data
3. Share the app URL
4. Later: Import your backup to restore

### Scenario 2: Switching Computers
**Goal**: Move your data to a new device

1. On old computer: Export data
2. Upload backup to cloud storage or email to yourself
3. On new computer: Open app
4. Import the backup file
5. Done! All data transferred

### Scenario 3: Regular Backups
**Goal**: Keep periodic backups for safety

1. Export data weekly/monthly
2. Name files with dates: `backup-2025-10-02.json`
3. Store in cloud storage
4. Keep last 3-5 backups
5. Delete old backups to save space

### Scenario 4: Data Corruption
**Goal**: Fix corrupted localStorage

1. Try exporting data (might fail)
2. Clear all data
3. If you have a backup: Import it
4. If no backup: Start fresh with defaults

### Scenario 5: Testing Changes
**Goal**: Experiment without losing data

1. Export current state
2. Make changes/test features
3. If happy: Keep changes
4. If not: Clear data and import backup

## Troubleshooting

### Export Issues

**Problem**: Export button doesn't work
- Check browser console for errors
- Try a different browser
- Make sure JavaScript is enabled

**Problem**: File downloads but is empty
- Check if you have any saved data
- Try opening the JSON file in a text editor
- Look for console errors during export

### Import Issues

**Problem**: "Error importing data" message
- Make sure the file is valid JSON
- Try opening it in a text editor to check format
- Don't manually edit the file unless you know JSON syntax
- Re-export from the app to get a fresh backup

**Problem**: Import succeeds but data doesn't appear
- Make sure the page reloaded after import
- Check browser console for errors
- Try clearing cache and importing again

**Problem**: Some data restored, some missing
- Old backup files don't have all data types
- Check the backup file in a text editor
- Some data types might not have been saved originally

### File Management

**Problem**: Can't find downloaded backup file
- Check your browser's Downloads folder
- Check browser download settings/history
- Try exporting again

**Problem**: File won't upload during import
- Check file extension is `.json`
- Make sure file isn't corrupted
- Try copying contents to a new file

## Best Practices

### 1. Regular Backups
- Export data before making major changes
- Weekly backups recommended for active users
- Before any system updates or browser changes

### 2. File Naming
Use descriptive names with dates:
- ✅ `cowell-budget-backup-2025-10-02.json`
- ✅ `before-tax-season-2025.json`
- ✅ `backup-weekly-oct-2025.json`
- ❌ `backup.json` (not descriptive)
- ❌ `export (1).json` (confusing)

### 3. Storage Locations
Store backups in multiple places:
- **Primary**: Cloud storage (auto-synced)
- **Secondary**: Local external drive
- **Tertiary**: Email to yourself

### 4. Before Clearing
Always follow this checklist:
- [ ] Export current data
- [ ] Verify file downloaded
- [ ] Open file to confirm it's not empty
- [ ] Save file to cloud storage
- [ ] Only then click "Clear All Data"

### 5. Version Control
Keep multiple versions for safety:
```
backups/
  ├── cowell-budget-2025-09-01.json
  ├── cowell-budget-2025-09-15.json
  ├── cowell-budget-2025-10-01.json
  └── cowell-budget-2025-10-02.json (latest)
```

## Technical Details

### What Gets Cleared
The "Clear All Data" function removes all localStorage keys starting with:
- `cowell_budget_*`
- `tax_checklist_*`
- `superannuation_*`

### What DOESN'T Get Cleared
- The base `financial_overview.json` file
- App code and functionality
- Browser history or cookies (other than localStorage)
- Any data from other websites

### Data Storage
All data is stored in browser localStorage:
- Persistent across sessions
- Survives browser restarts
- Limited to ~5-10MB per domain
- Specific to the browser/device

### Export Process
1. Collects all data from localStorage
2. Parses JSON where needed
3. Packages into single JSON object
4. Adds metadata (date, version)
5. Creates downloadable Blob
6. Triggers browser download

### Import Process
1. Reads uploaded file
2. Validates JSON format
3. Extracts each data category
4. Writes to localStorage
5. Tracks what was restored
6. Reloads page to apply changes

## Sample Backup File

A sample backup file structure is included: `sample-complete-backup.json`

This shows the exact format used by the app. You can:
- View it to understand the structure
- Use it as a template
- Import it to test the import function (won't change anything if empty)

## Frequently Asked Questions

### Q: How often should I backup?
**A**: Before any major changes or weekly if you use the app regularly.

### Q: Can I edit the backup file manually?
**A**: Yes, if you know JSON syntax. Be careful - invalid JSON won't import.

### Q: Will old backup files still work?
**A**: Yes, but they only restore budget and scenarios (not the new data types).

### Q: How big will the backup file be?
**A**: Usually 10-100 KB depending on how much data you have.

### Q: Can I share my backup with someone else?
**A**: Yes, but it contains your personal financial data - be careful!

### Q: What if I lose my backup file?
**A**: Unfortunately, if you've cleared the data, it's gone. Always keep multiple backups.

### Q: Can I merge backup files?
**A**: Not automatically, but you can manually edit JSON to combine data.

### Q: Does this backup the transaction history?
**A**: No, the base transaction data is in `financial_overview.json` and doesn't need backing up (it's not stored in localStorage).

## Support

If you encounter issues:

1. **Check browser console** (F12 → Console tab)
2. **Try a different browser** (Chrome, Firefox, Edge)
3. **Verify file integrity** (open JSON in text editor)
4. **Test with sample file** (import `sample-complete-backup.json`)
5. **Clear cache** (browser settings → clear cache)

## Summary

The new complete backup system ensures:

- ✅ **All data is backed up** - Nothing is missed
- ✅ **Easy to use** - One click to export, one click to import
- ✅ **Safe** - Multiple confirmations and clear feedback
- ✅ **Compatible** - Works with old and new backup files
- ✅ **Transparent** - Shows exactly what's being saved/restored

**Remember**: Always export before clearing. It's your safety net!

---

**Last Updated**: October 2, 2025  
**Version**: 1.0  
**App**: Cowell Family Budget Command Centre
