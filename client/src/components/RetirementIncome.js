import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RETIREMENT_INCOME
} from '../constants/financialConstants';
import { saveData, loadData, STORAGE_KEYS } from '../utils/dataStorage';

function RetirementIncome() {
  const [inputs, setInputs] = useState(() => {
    // Load saved inputs on initial render
    return loadData(STORAGE_KEYS.RETIREMENT_INCOME, {
      balance: '',
      withdrawalRate: String(RETIREMENT_INCOME.FOUR_PERCENT_RULE * 100),
      years: String(RETIREMENT_INCOME.STANDARD_DURATION_YEARS)
    });
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Save inputs whenever they change
  useEffect(() => {
    saveData(STORAGE_KEYS.RETIREMENT_INCOME, inputs);
  }, [inputs]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculateIncome = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/calculate/retirement-income', inputs);
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating retirement income:', error);
      alert('Error calculating retirement income. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="retirement-income">
      <h2>Retirement Income Calculator</h2>
      
      <div className="card">
        <p style={{marginBottom: '20px', color: '#666'}}>
          Calculate your potential retirement income based on your superannuation balance and withdrawal strategy.
        </p>
        
        <form onSubmit={calculateIncome}>
          <div className="grid-2">
            <div className="form-group">
              <label>Retirement Balance ($)</label>
              <input
                type="number"
                name="balance"
                value={inputs.balance}
                onChange={handleChange}
                placeholder="e.g., 500000"
                required
              />
            </div>
            <div className="form-group">
              <label>Annual Withdrawal Rate (%)</label>
              <input
                type="number"
                step="0.1"
                name="withdrawalRate"
                value={inputs.withdrawalRate}
                onChange={handleChange}
                placeholder="e.g., 4"
                required
              />
            </div>
            <div className="form-group">
              <label>Retirement Duration (years)</label>
              <input
                type="number"
                name="years"
                value={inputs.years}
                onChange={handleChange}
                placeholder="e.g., 30"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Income'}
          </button>
        </form>
      </div>

      {results && (
        <>
          <div className="grid-2" style={{marginTop: '30px'}}>
            <div className="stat-card">
              <div className="stat-value">
                ${results.monthlyIncome.toLocaleString()}
              </div>
              <div className="stat-label">Monthly Income</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                ${results.annualIncome.toLocaleString()}
              </div>
              <div className="stat-label">Annual Income</div>
            </div>
          </div>

          <div className="result-card">
            <h3 style={{marginBottom: '20px'}}>Income Summary</h3>
            <div className="result-item">
              <span className="result-label">Total Income Over {inputs.years} Years:</span>
              <span className="result-value">${results.totalOverYears.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Withdrawal Rate:</span>
              <span className="result-value">{inputs.withdrawalRate}% per year</span>
            </div>
          </div>

          <div className="info-box">
            <h3>Understanding the {RETIREMENT_INCOME.FOUR_PERCENT_RULE * 100}% Rule</h3>
            <p>The "{RETIREMENT_INCOME.FOUR_PERCENT_RULE * 100}% rule" is a common retirement planning guideline suggesting you can withdraw {RETIREMENT_INCOME.FOUR_PERCENT_RULE * 100}% of your retirement savings annually, adjusted for inflation, with a high probability your money will last {RETIREMENT_INCOME.STANDARD_DURATION_YEARS} years.</p>
            <p style={{marginTop: '10px'}}><strong>Important:</strong> This calculation doesn't account for investment returns during retirement or inflation. Consider consulting a financial adviser for a comprehensive retirement plan.</p>
          </div>
        </>
      )}

      <div className="info-box">
        <h3>Withdrawal Strategies</h3>
        <p><strong>Conservative ({RETIREMENT_INCOME.CONSERVATIVE_RATE * 100}%):</strong> Lower withdrawal rate for longer retirement or market uncertainty</p>
        <p><strong>Moderate ({RETIREMENT_INCOME.MODERATE_RATE * 100}%):</strong> Standard approach balancing income needs and sustainability</p>
        <p><strong>Aggressive ({RETIREMENT_INCOME.AGGRESSIVE_RATE * 100}%+):</strong> Higher income but increased risk of depleting funds early</p>
      </div>
    </div>
  );
}

export default RetirementIncome;
