const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { TAX_RATES, TIME_PERIODS, getMinimumDrawdownPercentage } = require('./constants/financialConstants');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Superannuation calculation utilities
const calculateCompoundInterest = (principal, rate, years, contributions, contributionFrequency = TIME_PERIODS.MONTHS_PER_YEAR) => {
  const monthlyRate = rate / 100 / TIME_PERIODS.MONTHS_PER_YEAR;
  const months = years * TIME_PERIODS.MONTHS_PER_YEAR;
  let balance = principal;
  const monthlyContribution = contributions / TIME_PERIODS.MONTHS_PER_YEAR;
  
  const projections = [];
  
  for (let month = 0; month <= months; month++) {
    if (month > 0) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
    }
    
    if (month % TIME_PERIODS.MONTHS_PER_YEAR === 0) {
      projections.push({
        year: month / TIME_PERIODS.MONTHS_PER_YEAR,
        balance: Math.round(balance * 100) / 100,
        contributions: Math.round((monthlyContribution * month) * 100) / 100,
        interest: Math.round((balance - principal - (monthlyContribution * month)) * 100) / 100
      });
    }
  }
  
  return projections;
};

const calculateRetirementIncome = (balance, withdrawalRate, years) => {
  const annualWithdrawal = balance * (withdrawalRate / 100);
  const monthlyIncome = annualWithdrawal / TIME_PERIODS.MONTHS_PER_YEAR;
  
  return {
    annualIncome: Math.round(annualWithdrawal * 100) / 100,
    monthlyIncome: Math.round(monthlyIncome * 100) / 100,
    totalOverYears: Math.round((annualWithdrawal * years) * 100) / 100
  };
};

const calculateTaxBenefit = (contributions, taxRate) => {
  // Concessional contributions are taxed at 15% instead of marginal rate
  const superTaxRate = TAX_RATES.SUPER_CONTRIBUTIONS;
  const taxSaved = contributions * ((taxRate - superTaxRate) / 100);
  
  return {
    taxSaved: Math.round(taxSaved * 100) / 100,
    effectiveContribution: Math.round((contributions - (contributions * superTaxRate / 100)) * 100) / 100
  };
};

const calculateMinimumDrawdown = (age, balance) => {
  const percentage = getMinimumDrawdownPercentage(age);
  
  return {
    percentage,
    minimumAmount: Math.round((balance * percentage / 100) * 100) / 100
  };
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Superannuation Tracker API' });
});

// Calculate superannuation projections
app.post('/api/calculate/projection', (req, res) => {
  try {
    const { currentBalance, annualContribution, returnRate, yearsToRetirement } = req.body;
    
    if (!currentBalance || !annualContribution || !returnRate || !yearsToRetirement) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const projections = calculateCompoundInterest(
      parseFloat(currentBalance),
      parseFloat(returnRate),
      parseInt(yearsToRetirement),
      parseFloat(annualContribution)
    );
    
    const finalBalance = projections[projections.length - 1].balance;
    
    res.json({
      projections,
      finalBalance,
      totalContributions: projections[projections.length - 1].contributions,
      totalInterest: projections[projections.length - 1].interest
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate retirement income
app.post('/api/calculate/retirement-income', (req, res) => {
  try {
    const { balance, withdrawalRate, years } = req.body;
    
    if (!balance || !withdrawalRate || !years) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const income = calculateRetirementIncome(
      parseFloat(balance),
      parseFloat(withdrawalRate),
      parseInt(years)
    );
    
    res.json(income);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate tax benefits
app.post('/api/calculate/tax-benefit', (req, res) => {
  try {
    const { contributions, taxRate } = req.body;
    
    if (!contributions || !taxRate) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const benefit = calculateTaxBenefit(
      parseFloat(contributions),
      parseFloat(taxRate)
    );
    
    res.json(benefit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate minimum drawdown
app.post('/api/calculate/minimum-drawdown', (req, res) => {
  try {
    const { age, balance } = req.body;
    
    if (!age || !balance) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    const drawdown = calculateMinimumDrawdown(
      parseInt(age),
      parseFloat(balance)
    );
    
    res.json(drawdown);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
