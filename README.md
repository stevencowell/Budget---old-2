# 🏦 Superannuation Tracker

A comprehensive web application for tracking and calculating superannuation (retirement fund) information. This app helps you project your retirement savings, calculate retirement income, understand tax benefits, and determine minimum pension drawdowns.

## Features

### 📊 Dashboard
- Track your current superannuation balance
- Record personal details (age, retirement age)
- Monitor annual contributions
- View key superannuation information and caps

### 📈 Projection Calculator
- Calculate long-term superannuation projections with compound growth
- Visualize growth over time with interactive charts
- See breakdown of contributions vs. interest earned
- Customize return rates and contribution amounts

### 💰 Retirement Income Calculator
- Estimate retirement income based on your balance
- Calculate monthly and annual income streams
- Understand different withdrawal strategies (3%, 4%, 5% rules)
- Project total income over retirement period

### 🧾 Tax Benefits Calculator
- Calculate tax savings from concessional contributions
- Compare superannuation tax rate (15%) vs. marginal tax rate
- Understand effective net contributions
- View current Australian tax rates

### 📉 Minimum Drawdown Calculator
- Calculate minimum pension withdrawal requirements
- Age-based drawdown rates
- Monthly and fortnightly payment estimates
- Compliance with Australian superannuation regulations

## Technology Stack

**Backend:**
- Node.js
- Express.js
- RESTful API architecture

**Frontend:**
- React 18
- Recharts for data visualization
- Axios for API calls
- Modern CSS with gradient design

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or download the repository**

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

   This will install both server and client dependencies.

   Alternatively, install manually:
   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Start the application**

   **Option 1: Run both server and client separately (recommended for development)**
   
   Terminal 1 - Start the backend server:
   ```bash
   npm start
   # Or for development with auto-restart:
   npm run dev
   ```

   Terminal 2 - Start the React frontend:
   ```bash
   npm run client
   ```

   **Option 2: Run server only and build client for production**
   ```bash
   # Build the client
   npm run client-build

   # Start the server
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### POST `/api/calculate/projection`
Calculate superannuation projections with compound interest.

**Request Body:**
```json
{
  "currentBalance": 50000,
  "annualContribution": 12000,
  "returnRate": 7,
  "yearsToRetirement": 30
}
```

### POST `/api/calculate/retirement-income`
Calculate retirement income based on balance and withdrawal rate.

**Request Body:**
```json
{
  "balance": 500000,
  "withdrawalRate": 4,
  "years": 30
}
```

### POST `/api/calculate/tax-benefit`
Calculate tax benefits from concessional contributions.

**Request Body:**
```json
{
  "contributions": 15000,
  "taxRate": 37
}
```

### POST `/api/calculate/minimum-drawdown`
Calculate minimum pension drawdown requirements.

**Request Body:**
```json
{
  "age": 65,
  "balance": 500000
}
```

## Key Superannuation Information (2025)

- **Concessional Contribution Cap:** $27,500 per year
- **Non-concessional Contribution Cap:** $110,000 per year
- **Superannuation Guarantee Rate:** 11.5% of ordinary time earnings
- **Preservation Age:** Typically 60 years old
- **Concessional Contributions Tax:** 15% (vs. marginal tax rate)

## Calculations Explained

### Compound Interest Projection
Uses monthly compounding with regular contributions to project future balance:
- Monthly interest rate applied to balance
- Regular contributions added monthly
- Tracks total contributions and interest separately

### Retirement Income
Based on sustainable withdrawal rates:
- Conservative: 3-3.5% annually
- Moderate: 4-4.5% annually (traditional "4% rule")
- Aggressive: 5%+ annually

### Tax Benefits
Calculates savings from concessional contributions:
- Marginal tax rate - 15% superannuation tax = tax saved
- Particularly beneficial for middle to high income earners

### Minimum Drawdown
Age-based minimum withdrawal rates:
- Under 65: 4%
- 65-74: 5%
- 75-79: 6%
- 80-84: 7%
- 85-89: 9%
- 90-94: 11%
- 95+: 14%

## Important Disclaimers

⚠️ **This application is for informational and educational purposes only.**

- Not financial advice - consult a licensed financial adviser
- Projections assume consistent returns - actual returns vary
- Tax calculations are simplified - consult a tax professional
- Australian superannuation rules and rates may change
- Past performance doesn't indicate future results

## Project Structure

```
superannuation-tracker/
├── server/
│   └── index.js           # Express backend API
├── client/
│   ├── public/
│   │   └── index.html     # HTML template
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── ProjectionCalculator.js
│   │   │   ├── RetirementIncome.js
│   │   │   ├── TaxBenefits.js
│   │   │   └── MinimumDrawdown.js
│   │   ├── App.js         # Main app component
│   │   ├── App.css        # Styling
│   │   └── index.js       # React entry point
│   └── package.json       # Client dependencies
├── package.json           # Server dependencies
├── .env                   # Environment variables
└── README.md             # This file
```

## Future Enhancements

Potential features for future development:
- Data persistence with database
- User accounts and authentication
- Multiple superannuation accounts tracking
- Import data from super fund statements
- Scenario comparison tools
- Inflation-adjusted projections
- Goal setting and progress tracking
- Export reports to PDF

## Contributing

This is an educational project. Feel free to fork and modify for your own use.

## License

MIT License - feel free to use and modify as needed.

---

**Built with ❤️ for better retirement planning**
