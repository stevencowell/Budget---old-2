import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TAX_RATES,
  CONTRIBUTION_CAPS
} from '../constants/financialConstants';
import { saveData, loadData, STORAGE_KEYS } from '../utils/dataStorage';

function TaxBenefits() {
  const [inputs, setInputs] = useState(() => {
    // Load saved inputs on initial render
    return loadData(STORAGE_KEYS.TAX_BENEFITS, {
      contributions: '',
      taxRate: ''
    });
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Save inputs whenever they change
  useEffect(() => {
    saveData(STORAGE_KEYS.TAX_BENEFITS, inputs);
  }, [inputs]);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculateBenefit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/calculate/tax-benefit', inputs);
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating tax benefit:', error);
      alert('Error calculating tax benefit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tax-benefits">
      <h2>Tax Benefits Calculator</h2>
      
      <div className="card">
        <p style={{marginBottom: '20px', color: '#666'}}>
          Calculate the tax savings from making concessional (pre-tax) superannuation contributions.
        </p>
        
        <form onSubmit={calculateBenefit}>
          <div className="grid-2">
            <div className="form-group">
              <label>Annual Concessional Contributions ($)</label>
              <input
                type="number"
                name="contributions"
                value={inputs.contributions}
                onChange={handleChange}
                placeholder="e.g., 15000"
                required
              />
            </div>
            <div className="form-group">
              <label>Your Marginal Tax Rate (%)</label>
              <input
                type="number"
                step="0.01"
                name="taxRate"
                value={inputs.taxRate}
                onChange={handleChange}
                placeholder="e.g., 37"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Tax Benefit'}
          </button>
        </form>
      </div>

      {results && (
        <>
          <div className="grid-2" style={{marginTop: '30px'}}>
            <div className="stat-card">
              <div className="stat-value">
                ${results.taxSaved.toLocaleString()}
              </div>
              <div className="stat-label">Tax Saved Annually</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                ${results.effectiveContribution.toLocaleString()}
              </div>
              <div className="stat-label">Effective Net Contribution</div>
            </div>
          </div>

          <div className="result-card">
            <h3 style={{marginBottom: '20px'}}>Tax Benefit Breakdown</h3>
            <div className="result-item">
              <span className="result-label">Your Marginal Tax Rate:</span>
              <span className="result-value">{inputs.taxRate}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Superannuation Tax Rate:</span>
              <span className="result-value">{TAX_RATES.SUPER_CONTRIBUTIONS_PERCENTAGE}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Tax Rate Difference:</span>
              <span className="result-value">{inputs.taxRate - TAX_RATES.SUPER_CONTRIBUTIONS_PERCENTAGE}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Annual Tax Saved:</span>
              <span className="result-value">${results.taxSaved.toLocaleString()}</span>
            </div>
          </div>
        </>
      )}

      <div className="info-box">
        <h3>Australian Tax Rates (2024-25)</h3>
        <p><strong>$0 - $18,200:</strong> 0% (tax-free threshold)</p>
        <p><strong>$18,201 - $45,000:</strong> 19%</p>
        <p><strong>$45,001 - $120,000:</strong> 32.5%</p>
        <p><strong>$120,001 - $180,000:</strong> 37%</p>
        <p><strong>$180,001+:</strong> 45%</p>
        <p style={{marginTop: '10px'}}><em>Note: Rates don't include Medicare Levy (2%)</em></p>
      </div>

      <div className="info-box">
        <h3>Key Points About Concessional Contributions</h3>
        <p>• Concessional contributions are taxed at {TAX_RATES.SUPER_CONTRIBUTIONS_PERCENTAGE}% in your super fund (instead of your marginal rate)</p>
        <p>• The concessional contribution cap is ${CONTRIBUTION_CAPS.CONCESSIONAL.toLocaleString()} per year (2025)</p>
        <p>• Includes employer contributions and salary sacrifice amounts</p>
        <p>• Excess contributions are taxed at your marginal rate plus an excess concessional contributions charge</p>
        <p>• Those with income over ${TAX_RATES.DIVISION_293_THRESHOLD.toLocaleString()} pay an additional {TAX_RATES.DIVISION_293_ADDITIONAL_TAX * 100}% Division 293 tax on contributions</p>
      </div>
    </div>
  );
}

export default TaxBenefits;
