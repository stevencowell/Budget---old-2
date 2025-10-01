import React, { useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function ProjectionCalculator() {
  const [inputs, setInputs] = useState({
    currentBalance: '',
    annualContribution: '',
    returnRate: '7',
    yearsToRetirement: ''
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculateProjection = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/calculate/projection', inputs);
      setResults(response.data);
    } catch (error) {
      console.error('Error calculating projection:', error);
      alert('Error calculating projection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projection-calculator">
      <h2>Superannuation Projection Calculator</h2>
      
      <div className="card">
        <form onSubmit={calculateProjection}>
          <div className="grid-2">
            <div className="form-group">
              <label>Current Balance ($)</label>
              <input
                type="number"
                name="currentBalance"
                value={inputs.currentBalance}
                onChange={handleChange}
                placeholder="e.g., 50000"
                required
              />
            </div>
            <div className="form-group">
              <label>Annual Contribution ($)</label>
              <input
                type="number"
                name="annualContribution"
                value={inputs.annualContribution}
                onChange={handleChange}
                placeholder="e.g., 12000"
                required
              />
            </div>
            <div className="form-group">
              <label>Expected Annual Return Rate (%)</label>
              <input
                type="number"
                step="0.1"
                name="returnRate"
                value={inputs.returnRate}
                onChange={handleChange}
                placeholder="e.g., 7"
                required
              />
            </div>
            <div className="form-group">
              <label>Years Until Retirement</label>
              <input
                type="number"
                name="yearsToRetirement"
                value={inputs.yearsToRetirement}
                onChange={handleChange}
                placeholder="e.g., 30"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Calculating...' : 'Calculate Projection'}
          </button>
        </form>
      </div>

      {results && (
        <>
          <div className="result-card">
            <h3 style={{marginBottom: '20px'}}>Projection Results</h3>
            <div className="result-item">
              <span className="result-label">Final Balance at Retirement:</span>
              <span className="result-value">${results.finalBalance.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Contributions:</span>
              <span className="result-value">${results.totalContributions.toLocaleString()}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Total Interest Earned:</span>
              <span className="result-value">${results.totalInterest.toLocaleString()}</span>
            </div>
          </div>

          <div className="card" style={{marginTop: '30px'}}>
            <h3>Growth Projection Over Time</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={results.projections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="balance" stroke="#667eea" strokeWidth={3} name="Total Balance" />
                <Line type="monotone" dataKey="contributions" stroke="#764ba2" strokeWidth={2} name="Contributions" />
                <Line type="monotone" dataKey="interest" stroke="#48bb78" strokeWidth={2} name="Interest Earned" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="info-box">
            <p><strong>Note:</strong> This projection assumes a consistent annual return rate of {inputs.returnRate}%. 
            Actual returns will vary based on market conditions and your investment choices. 
            Past performance is not indicative of future results.</p>
          </div>
        </>
      )}
    </div>
  );
}

export default ProjectionCalculator;
