# How to Use Clickable Anomaly Cards

## Quick Start Guide

### Step 1: Navigate to AI Insights
1. Open the application
2. Click on the **"🤖 AI Insights"** tab in the navigation bar
3. Scroll down to the **"⚠️ Unusual Spending Patterns"** section

### Step 2: Browse Anomaly Cards
You'll see cards displaying flagged transactions with:
```
┌────────────────────────────────────────────┐
│  HIGH              30/11/2024              │
│                                            │
│  TFR to 9351515L84 MOB To-S C & A         │
│  -$20,000.00                               │
│                                            │
│  Airbnb Property > Airbnb Loan Payment    │
│                                            │
│  Why flagged: Significantly higher than   │
│  typical Airbnb Property spending         │
│  Expected range: -$529 - $4,830           │
│                                            │
│  Click to see full details and related... │
└────────────────────────────────────────────┘
```

### Step 3: Click Any Card
- **Hover** over a card - it will lift up with enhanced shadow
- **Click** anywhere on the card
- A detailed modal window will appear

### Step 4: Review Details in Modal

#### Modal Structure:
```
┌─────────────────────────────────────────────────────────────┐
│  ⚠️ Unusual Transaction Details              ✕              │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────┐               │
│  │  HIGH Priority    30 Nov 2024           │               │
│  │                                          │               │
│  │  TFR to 9351515L84 MOB To-S C & A      │               │
│  │  -$20,000.00                            │               │
│  │                                          │               │
│  │  Why flagged: Significantly higher...   │               │
│  └─────────────────────────────────────────┘               │
│                                                              │
│  ┌──────────┬──────────┬──────────┬──────────┐            │
│  │   This   │ Category │ Typical  │ Related  │            │
│  │   Tx     │ Average  │  Range   │   Tx     │            │
│  ├──────────┼──────────┼──────────┼──────────┤            │
│  │ $20,000  │  $2,680  │ $529-    │    28    │            │
│  │          │          │  $4,830  │          │            │
│  └──────────┴──────────┴──────────┴──────────┘            │
│                                                              │
│  Recent Airbnb Property > Airbnb Loan Payment              │
│  Transactions (±3 months)                                   │
│                                                              │
│  Compare this flagged transaction with other               │
│  transactions in the same category...                       │
│                                                              │
│  ┌────────────────────────────────────────────────┐       │
│  │ Date      │ Description │ Amount   │ Note      │       │
│  ├───────────┼─────────────┼──────────┼───────────┤       │
│  │ 30 Nov 24 │ TFR to...   │-$20,000  │👈Flagged  │       │
│  │ 15 Nov 24 │ TFR to...   │ -$2,471  │           │       │
│  │ 03 Nov 24 │ TFR to...   │ -$2,200  │           │       │
│  │ 22 Oct 24 │ TFR to...   │ -$1,384  │           │       │
│  └───────────┴─────────────┴──────────┴───────────┘       │
│                                                              │
│  💡 What to do next:                                       │
│  • Verify this transaction is legitimate...                │
│  • Check if this is a one-time expense...                  │
│  • Consider if this category needs budget...               │
│  • Review if the merchant needs recategorization           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Step 5: Close the Modal
Three ways to close:
1. **Click the ✕ button** in the top-right corner
2. **Click the dark overlay** outside the modal
3. **Press the ESC key** on your keyboard

## Understanding the Information

### Priority Badges
- **HIGH** (Red/Orange) - Urgent attention needed, significant deviation
- **MEDIUM** (Yellow) - Notable anomaly worth reviewing
- **LOW** (Blue) - Minor deviation for awareness

### Statistical Boxes
1. **This Transaction**: The actual amount of the flagged transaction
2. **Category Average**: What you typically spend in this category
3. **Typical Range**: The min-max range of your normal spending
4. **Related Transactions**: How many similar transactions found (context size)

### Transaction Table Highlights
- **Orange highlighted row** = The flagged transaction (marked with 👈)
- **Red amounts** = Expenses (negative)
- **Green amounts** = Income (positive)
- **Sorted by date** = Most recent at top

### Why This Matters
The related transactions table lets you:
- **See patterns**: Is this a one-time spike or new normal?
- **Compare amounts**: How much higher than usual?
- **Verify legitimacy**: Does this match expected business/personal expenses?
- **Identify duplicates**: Are there similar amounts on close dates?

## Common Use Cases

### Scenario 1: Large Loan Payment
**Card shows**: $20,000 payment flagged as unusually high
**In modal**: See that typical payments are $2,000-$3,000
**Action**: Verify this was an intentional extra payment toward principal

### Scenario 2: Duplicate Charge
**Card shows**: HIGH priority, "Possible duplicate transaction"
**In modal**: See two identical amounts charged on the same day
**Action**: Contact bank or merchant to dispute duplicate

### Scenario 3: Subscription Price Increase
**Card shows**: MEDIUM priority on streaming service
**In modal**: See price gradually increased from $9.99 to $15.99
**Action**: Review if subscription is still worth the cost

### Scenario 4: Category Miscategorization
**Card shows**: HIGH priority on grocery expense
**In modal**: See it's actually a $500 electronics purchase
**Action**: Recategorize transaction to "Electronics & Tech"

## Tips for Best Results

### Regular Review
- Check AI Insights weekly or monthly
- Review HIGH priority anomalies first
- Look for patterns across multiple cards

### Pattern Recognition
- Compare transaction dates - are spikes seasonal?
- Check if amounts are round numbers (might be transfers)
- Note recurring merchants with varying amounts

### Follow-Up Actions
After reviewing details:
1. Mark suspicious transactions for follow-up
2. Update budget categories if patterns have changed
3. Recategorize transactions if needed
4. Set alerts for specific merchant patterns

### Filter Options
Use the filter checkboxes above the cards:
- ☑️ **Show all** - Display all anomalies (default)
- ☑️ **High priority only** - Show only urgent items

## Keyboard Shortcuts

- **ESC** - Close modal
- **Tab** - Navigate between interactive elements
- **Enter** - Activate focused element

## Mobile/Touch Devices

On tablets and phones:
- **Tap** any card to open details
- **Swipe down** or tap overlay to close modal
- **Scroll** within modal to see all information
- Cards stack vertically for easy browsing

## Troubleshooting

### Card won't open?
- Ensure JavaScript is enabled
- Refresh the page
- Check browser console for errors

### Modal appears but data is missing?
- Verify transaction data has loaded
- Check that related transactions exist
- May need to wait for AI analysis to complete

### Can't close modal?
- Try ESC key
- Click/tap the dark overlay
- Refresh page as last resort

## Privacy & Security

- All analysis happens locally in your browser
- No transaction details sent to external servers
- Modal only shows transactions you own
- Close modal to hide sensitive information

---

**Need Help?** Refer to AI_INSIGHTS_GUIDE.md for more information about the AI analysis features.