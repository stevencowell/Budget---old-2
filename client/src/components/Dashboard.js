import React, { useState } from 'react';

function Dashboard() {
  const [profile, setProfile] = useState({
    currentBalance: '',
    age: '',
    retirementAge: '',
    annualContribution: ''
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const yearsToRetirement = profile.retirementAge && profile.age ? 
    parseInt(profile.retirementAge) - parseInt(profile.age) : 0;

  return (
    <div className="dashboard">
      <h2>Your Superannuation Overview</h2>
      
      <div className="card">
        <h3>Personal Details</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Current Age</label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              placeholder="e.g., 35"
            />
          </div>
          <div className="form-group">
            <label>Planned Retirement Age</label>
            <input
              type="number"
              name="retirementAge"
              value={profile.retirementAge}
              onChange={handleChange}
              placeholder="e.g., 65"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Current Superannuation</h3>
        <div className="grid-2">
          <div className="form-group">
            <label>Current Balance ($)</label>
            <input
              type="number"
              name="currentBalance"
              value={profile.currentBalance}
              onChange={handleChange}
              placeholder="e.g., 50000"
            />
          </div>
          <div className="form-group">
            <label>Annual Contribution ($)</label>
            <input
              type="number"
              name="annualContribution"
              value={profile.annualContribution}
              onChange={handleChange}
              placeholder="e.g., 12000"
            />
          </div>
        </div>
        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button 
            className="btn-primary" 
            style={{
              padding: '12px 30px',
              fontSize: '16px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
            onClick={() => {
              if (profile.currentBalance && profile.age && profile.retirementAge) {
                alert('Profile saved! Your details have been recorded. Use the tabs above to explore different calculators.');
              } else {
                alert('Please fill in all required fields (Current Age, Planned Retirement Age, and Current Balance)');
              }
            }}
          >
            Save Profile
          </button>
        </div>
      </div>

      {profile.currentBalance && profile.age && profile.retirementAge && (
        <div className="grid-2">
          <div className="stat-card">
            <div className="stat-value">
              ${parseFloat(profile.currentBalance).toLocaleString()}
            </div>
            <div className="stat-label">Current Balance</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{yearsToRetirement}</div>
            <div className="stat-label">Years to Retirement</div>
          </div>
          {profile.annualContribution && (
            <>
              <div className="stat-card">
                <div className="stat-value">
                  ${parseFloat(profile.annualContribution).toLocaleString()}
                </div>
                <div className="stat-label">Annual Contribution</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  ${(parseFloat(profile.annualContribution) / 12).toLocaleString(undefined, {maximumFractionDigits: 0})}
                </div>
                <div className="stat-label">Monthly Contribution</div>
              </div>
            </>
          )}
        </div>
      )}

      <div className="info-box">
        <h3>Key Superannuation Information</h3>
        <p><strong>Concessional Contribution Cap (2025):</strong> $27,500 per year</p>
        <p><strong>Non-concessional Contribution Cap:</strong> $110,000 per year</p>
        <p><strong>Preservation Age:</strong> Typically 60 years old</p>
        <p><strong>Superannuation Guarantee:</strong> 11.5% of ordinary time earnings (2025)</p>
      </div>

      <div className="info-box">
        <p><strong>Getting Started:</strong> Use the tabs above to:</p>
        <ul style={{marginLeft: '20px', marginTop: '10px'}}>
          <li>Calculate long-term projections with compound growth</li>
          <li>Estimate retirement income based on your balance</li>
          <li>Understand tax benefits of concessional contributions</li>
          <li>Calculate minimum pension drawdown requirements</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;
