# Backup Quick Reference

## 🔄 Complete Backup System - At a Glance

### ✅ What's Backed Up (Everything!)

| Data Type | Description | Example |
|-----------|-------------|---------|
| **Budget Items** | Your custom budget entries | Monthly savings goals |
| **Scenarios** | What-if financial models | "What if I get a raise?" |
| **Category Changes** | Custom transaction categories | Moving "Uber" to Transport |
| **Subcategory Rules** | AI-learned patterns | Netflix → Subscriptions |
| **Tax Checklists** | Your tax doc tracking | ☑️ W2 received |
| **Superannuation Data** | Super balance & projections | Current balance: $150k |

---

## 📤 Export (Backup)

```
Click "Export Data" → File downloads → Save it safely
```

**File name format**: `cowell-budget-complete-backup-2025-10-02.json`

**What happens**: 
- All 6 data types collected
- Packaged into single JSON file
- Downloaded to your computer
- Confirmation message shown

**Time**: < 1 second

---

## 📥 Import (Restore)

```
Click "Import Data" → Select file → Confirm → Data restored
```

**What happens**:
- File uploaded and validated
- Each data type restored to localStorage
- Detailed restore message shown
- Page reloads automatically

**Time**: 1-2 seconds

---

## 🗑️ Clear All Data

```
Click "🗑️ Clear All Data" → Confirm (×2) → All data cleared
```

**What's cleared**:
- All 6 data types (everything in localStorage)
- App resets to fresh state

**What's kept**:
- Base transaction data (financial_overview.json)
- App code and functionality

**Safety**: Requires 2 confirmations

---

## 🔄 Complete Workflow

### Before Clearing (30 seconds)

1. ✅ Click "Export Data"
2. ✅ Wait for download
3. ✅ Save file to cloud/safe location
4. ✅ Verify file isn't empty

### Clearing (10 seconds)

5. ✅ Click "🗑️ Clear All Data"
6. ✅ Read warning carefully
7. ✅ Confirm twice
8. ✅ App reloads (clean state)

### After Clearing - To Restore (10 seconds)

9. ✅ Click "Import Data"
10. ✅ Select your backup file
11. ✅ Confirm restoration
12. ✅ App reloads (everything back!)

**Total time**: ~1 minute

---

## 💡 Quick Tips

### DO ✅
- Export before clearing
- Name files with dates
- Keep multiple backups
- Store in cloud
- Test import occasionally

### DON'T ❌
- Clear without exporting first
- Edit JSON unless you're sure
- Delete your only backup
- Share backups (personal data!)
- Ignore error messages

---

## 🚨 Emergency Recovery

### Lost data but have backup:
1. Click "Import Data"
2. Select backup file
3. Done! ✅

### Lost data, no backup:
1. Sorry, can't recover 😢
2. Start fresh with defaults
3. Export regularly from now on

---

## 📁 File Management

### Naming Convention
```
cowell-budget-complete-backup-YYYY-MM-DD.json
```

Examples:
- `cowell-budget-complete-backup-2025-10-02.json` ✅
- `before-tax-season-2025.json` ✅
- `backup-weekly.json` ✅
- `export.json` ❌ (not descriptive)

### Storage Recommendations

| Location | Priority | Auto-Sync | Space |
|----------|----------|-----------|-------|
| Google Drive | 🟢 High | Yes | Free (15GB) |
| Dropbox | 🟢 High | Yes | Free (2GB) |
| OneDrive | 🟢 High | Yes | Free (5GB) |
| External Drive | 🟡 Medium | No | Depends |
| Email | 🟡 Medium | Yes | Searchable |

---

## 🔍 Troubleshooting

| Problem | Solution |
|---------|----------|
| Export fails | Check console (F12), try different browser |
| File empty | Check if you have saved data |
| Import fails | Verify JSON format, try sample file |
| Can't find file | Check Downloads folder |
| Some data missing | Old backup format (partial restore) |
| Page won't reload | Refresh manually (F5) |

---

## 📊 Backup Schedule

### Recommended Frequency

| User Type | Frequency | Why |
|-----------|-----------|-----|
| **Heavy User** | Weekly | Lots of changes |
| **Regular User** | Bi-weekly | Moderate changes |
| **Light User** | Monthly | Few changes |
| **Before Major Change** | Always | Safety net |
| **Before Sharing** | Always | Must do |

---

## 🎯 Common Use Cases

### 1. Sharing App
```
Export → Clear → Share URL → Import (later)
```

### 2. New Computer
```
Old PC: Export → Upload to cloud
New PC: Download → Import
```

### 3. Regular Backup
```
Weekly: Export → Save with date → Delete old backups
```

### 4. Testing Changes
```
Export → Test features → Keep or Restore
```

### 5. Fix Corruption
```
Clear → Import last good backup
```

---

## 📝 Checklist: Before Clearing Data

Print or bookmark this checklist:

- [ ] Clicked "Export Data" button
- [ ] File downloaded successfully
- [ ] Opened file to verify not empty
- [ ] Uploaded to cloud storage
- [ ] Verified upload completed
- [ ] File size is reasonable (>1KB)
- [ ] Ready to clear data

**Only proceed if all checked!**

---

## 🔐 Security Note

**Backup files contain personal financial data:**
- Budget amounts
- Transaction categories
- Financial scenarios
- Tax information
- Super balances

**Keep them secure:**
- Don't share publicly
- Password-protect if sharing
- Store in private cloud folders
- Delete when no longer needed

---

## 📞 Quick Help

### Error Messages

| Message | Meaning | Action |
|---------|---------|--------|
| "Error importing data" | Invalid JSON | Check file format |
| "No data found to import" | Empty/old file | Use correct backup |
| "Error clearing data" | localStorage issue | Check browser settings |
| Export: "Error exporting..." | Collection failed | Check console |

### Browser Console
Press **F12** → **Console** tab → Look for errors

---

## ✨ What's New (Version 1.0)

### Previous Version (Legacy)
- ❌ Only exported budget + scenarios
- ❌ Lost category changes on clear
- ❌ Lost subcategory rules
- ❌ Lost tax progress
- ❌ Lost super data

### Current Version (Complete)
- ✅ Exports ALL 6 data types
- ✅ Nothing lost on clear
- ✅ Complete restore capability
- ✅ Detailed feedback
- ✅ Better error handling

---

## 📚 More Information

For detailed documentation, see:
- **COMPLETE_BACKUP_GUIDE.md** - Full documentation
- **sample-complete-backup.json** - Example file structure
- **HOW_TO_CLEAR_DATA.md** - Detailed clearing guide

---

**Remember**: Export first, clear second, import later! 🔄

**Last Updated**: October 2, 2025  
**Version**: 1.0
