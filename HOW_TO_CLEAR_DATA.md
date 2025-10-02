# How to Clear All Data - User Guide

## Quick Start

Want to share your Budget App with someone else? Here's how to clear your personal data safely:

### Step-by-Step Instructions

1. **Optional: Export Your Data First** (Recommended)
   - Click the "Export Data" button in the top right
   - This saves a backup of your customizations
   - You can re-import later if needed

2. **Click the Clear All Data Button**
   - Look for the red "🗑️ Clear All Data" button in the top right header
   - It's next to the Import/Export buttons

3. **Read the First Warning**
   - A dialog will appear showing what will be deleted
   - It will tell you how many saved items you have
   - Click "OK" to continue, or "Cancel" to keep your data

4. **Confirm One More Time**
   - A second confirmation dialog appears for safety
   - This is your last chance to cancel
   - Click "OK" to proceed with clearing

5. **Done!**
   - All your saved data is cleared
   - The page automatically reloads
   - The app is now in a fresh state, ready to share

## What Gets Cleared?

When you click "Clear All Data", the following will be removed:

- ✅ **Budget Customizations** - Any changes you made to budget items
- ✅ **Financial Scenarios** - All your saved what-if scenarios
- ✅ **Category Changes** - Custom category assignments you created
- ✅ **Subcategory Rules** - Custom subcategory rules (like Netflix → Subscriptions)
- ✅ **Tax Checklist** - Your progress on the tax document checklist
- ✅ **Superannuation Data** - All data from the Superannuation Tracker app

## What Does NOT Get Cleared?

The following will remain:

- ❌ **Base Financial Data** - Your original transactions JSON file
- ❌ **The App Itself** - All functionality remains the same
- ❌ **Default Settings** - Built-in defaults and calculations

## Safety Features

### Double Confirmation
You must click "OK" twice before any data is deleted. You can cancel at any time.

### Detailed Information
The dialog tells you exactly what will be deleted and how many items you have saved.

### Export Reminder
The dialog suggests exporting your data first as a backup.

### No Mistakes
If you accidentally clear data, you can restore it by importing your previously exported backup.

## Common Questions

### Q: Will this delete my transaction history?
**A: No.** It only clears your customizations and saved settings. Your base financial data (transactions) is stored in a JSON file and won't be affected.

### Q: Can I undo this after clearing?
**A: Only if you exported first.** If you exported your data before clearing, you can re-import it. Otherwise, the cleared data is permanently deleted.

### Q: Will the app still work after clearing?
**A: Yes!** The app will work exactly the same, just with default settings instead of your customizations.

### Q: Do I need to clear data before sharing?
**A: Not required, but recommended.** If you're sharing the app with others, clearing data ensures they start fresh without your personal customizations.

### Q: What if I only want to clear some data?
**A: Use Export/Import instead.** You can:
1. Export your data
2. Clear all data
3. Manually edit the exported JSON file
4. Import only what you want

### Q: How do I know if I have saved data?
**A: The clear dialog tells you.** When you click the button, it will show how many saved items you have.

## Tips

1. **Always export before clearing** if you might want your data back
2. **Name your exports with dates** like `my-budget-2024-10-02.json`
3. **Test after clearing** to make sure everything works as expected
4. **Keep backups** of your exports in a safe place

## Troubleshooting

### The button doesn't appear
- Make sure your browser supports JavaScript
- Try refreshing the page
- Check if your browser is blocking scripts

### The dialog doesn't show
- Check if your browser is blocking popups/dialogs
- Try a different browser
- Check browser console for errors

### Data isn't clearing
- Make sure you click "OK" on both confirmation dialogs
- Check your browser's localStorage settings
- Try clearing manually via browser settings (Developer Tools → Storage)

### App breaks after clearing
- This shouldn't happen! The app is designed to work with cleared data
- Try refreshing the page
- Check the browser console for errors
- Report the issue to the developer

## Technical Details

If you're interested in the technical details:

- Data is stored in browser localStorage
- Keys start with `cowell_budget_*`, `tax_checklist_*`, or `superannuation_*`
- Clearing removes these keys but doesn't touch other localStorage data
- The app falls back to default values when no saved data exists

## Need Help?

If you run into issues:
1. Try exporting and re-importing your data
2. Check the browser console for error messages
3. Try clearing browser cache and cookies
4. Contact the app developer with details about the issue

---

**Remember:** When in doubt, export first! It's always better to have a backup than to wish you had one.
