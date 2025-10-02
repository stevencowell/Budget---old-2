import React, { useState } from 'react';
import axios from 'axios';
import {
  MINIMUM_DRAWDOWN_RATES,
  TIME_PERIODS,
  AGE_THRESHOLDS
} from '../constants/financialConstants';

function MinimumDrawdown() {
  const [inputs, setInputs] = useState({
    age: '',
    balance: ''
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculateDrawdown = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/calculate/minimum-drawdown', inputs);
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating minimum drawdown:', error);
      alert('Error calculating minimum drawdown. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="minimum-drawdown">
      <h2>Minimum Pension Drawdown Calculator</h2>
      
      <div className="card">
        <p style={{marginBottom: '20px', color: '#666'}}>
          Calculate the minimum amount you must withdraw annually from your account-based pension.
        </p>
        
        <form onSubmit={calculateDrawdown}>
          <div className="grid-2">
            <div className="form-group">
              <label>Your Age</label>
              <input
                type="number"
                name="age"
                value={inputs.age}
                onChange={handleChange}
                placeholder="e.g., 65"
                required
              />
            </div>
            <div className="form-group">
              <label>Account Balance ($)</label>
              <input
                type="number"
                name="balance"
                value={inputs.balance}
                onChange={handleChange}
                placeholder="e.g., 500000"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Minimum Drawdown'}
          </button>
        </form>
      </div>

      {results && (
        <>
          <div className="grid-2" style={{marginTop: '30px'}}>
            <div className="stat-card">
              <div className="stat-value">{results.percentage}%</div>
              <div className="stat-label">Minimum Drawdown Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                ${results.minimumAmount.toLocaleString()}
              </div>
              <div className="stat-label">Minimum Annual Withdrawal</div>
            </div>
          </div>

          <div className="result-card">
            <h3 style={{marginBottom: '20px'}}>Drawdown Details</h3>
            <div className="result-item">
              <span className="result-label">Monthly Minimum (approx):</span>
              <span className="result-value">
                ${(results.minimumAmount / TIME_PERIODS.MONTHS_PER_YEAR).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </span>
            </div>
            <div className="result-item">
              <span className="result-label">Fortnightly Minimum (approx):</span>
              <span className="result-value">
                ${(results.minimumAmount / TIME_PERIODS.FORTNIGHTS_PER_YEAR).toLocaleString(undefined, {maximumFractionDigits: 0})}
              </span>
            </div>
          </div>
        </>
      )}

      <div className="info-box">
        <h3>Minimum Drawdown Rates by Age</h3>
        {MINIMUM_DRAWDOWN_RATES.map((bracket, index) => (
          <p key={index}>
            <strong>
              {bracket.minAge === 0 ? 'Under 65' : 
               bracket.maxAge === Infinity ? `${bracket.minAge}+` : 
               `${bracket.minAge}-${bracket.maxAge}`}:
            </strong> {bracket.percentage}%
          </p>
        ))}
      </div>

      <div className="info-box">
        <h3>About Minimum Pension Drawdowns</h3>
        <p>• These are the minimum amounts required by law to be withdrawn each financial year from account-based pensions</p>
        <p>• You can withdraw more than the minimum, but not less (except in your first year)</p>
        <p>• The percentage is based on your age at the start of the financial year</p>
        <p>• Minimum amounts are calculated on your account balance at the start of each financial year</p>
        <p>• Pension payments from super are generally tax-free if you're {AGE_THRESHOLDS.TAX_FREE_WITHDRAWAL_AGE} or over</p>
      </div>
    </div>
  );
}

export default MinimumDrawdown;
