import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  SUPER_RATES,
  TIME_PERIODS,
  INVESTMENT_DEFAULTS,
  AGE_THRESHOLDS,
  calculatePartTimeRatio,
  calculateLSLSuperContribution,
  calculateNetReturnRate
} from '../constants/financialConstants';
import { saveData, loadData, STORAGE_KEYS } from '../utils/dataStorage';

function RetirementPlanner() {
  // Personal details
  const steveAge = 54;
  const anneAge = 55;
  const steveDOB = '17-02-1971';
  const anneDOB = '10-04-1970';
  
  // Initial state with superannuation balances from tax returns
  const [inputs, setInputs] = useState(() => {
    // Load saved inputs on initial render
    return loadData(STORAGE_KEYS.RETIREMENT_PLANNER, {
      // Steve's details
      steveCurrentBalance: 250000, // Placeholder - update from tax return
      steveFortnightlyContribution: 500,
      steveCurrentSalary: 85000,
      steveLongServiceDays: 0,
      stevePartTimeStartAge: 60,
      stevePartTimeDays: 5, // days per week
      
      // Anne's details
      anneCurrentBalance: 220000, // Placeholder - update from tax return
      anneFortnightlyContribution: 500,
      anneCurrentSalary: 80000,
      anneLongServiceDays: 0,
      annePartTimeStartAge: 60,
      annePartTimeDays: 5, // days per week
      
      // Investment assumptions
      returnRate: INVESTMENT_DEFAULTS.RETURN_RATE, // Annual return %
      inflationRate: INVESTMENT_DEFAULTS.INFLATION_RATE, // Annual inflation %
      adminFees: INVESTMENT_DEFAULTS.ADMIN_FEES, // Annual admin fees %
      
      // Retirement assumptions
      retirementAge: AGE_THRESHOLDS.STANDARD_RETIREMENT,
      lifeExpectancy: AGE_THRESHOLDS.DEFAULT_LIFE_EXPECTANCY,
      desiredAnnualIncome: 80000, // Combined household income in retirement
    });
  });

  const [scenarios, setScenarios] = useState(() => {
    // Load saved scenarios on initial render
    return loadData(STORAGE_KEYS.RETIREMENT_SCENARIOS, []);
  });
  const [showComparison, setShowComparison] = useState(false);

  // Save inputs whenever they change
  useEffect(() => {
    saveData(STORAGE_KEYS.RETIREMENT_PLANNER, inputs);
  }, [inputs]);

  // Save scenarios whenever they change
  useEffect(() => {
    saveData(STORAGE_KEYS.RETIREMENT_SCENARIOS, scenarios);
  }, [scenarios]);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
    setInputs({ ...inputs, [e.target.name]: value });
  };

  const calculateYearsToRetirement = (currentAge) => {
    return Math.max(0, inputs.retirementAge - currentAge);
  };

  const calculateProjection = (person) => {
    const isSteve = person === 'steve';
    const currentAge = isSteve ? steveAge : anneAge;
    const currentBalance = isSteve ? inputs.steveCurrentBalance : inputs.anneCurrentBalance;
    const fortnightlyContribution = isSteve ? inputs.steveFortnightlyContribution : inputs.anneFortnightlyContribution;
    const annualSalary = isSteve ? inputs.steveCurrentSalary : inputs.anneCurrentSalary;
    const longServiceDays = isSteve ? inputs.steveLongServiceDays : inputs.anneLongServiceDays;
    const partTimeStartAge = isSteve ? inputs.stevePartTimeStartAge : inputs.annePartTimeStartAge;
    const partTimeDays = isSteve ? inputs.stevePartTimeDays : inputs.annePartTimeDays;
    
    const yearsToRetirement = calculateYearsToRetirement(currentAge);
    const netReturnRate = calculateNetReturnRate(inputs.returnRate, inputs.adminFees);
    
    let balance = currentBalance;
    const projections = [];
    
    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = currentAge + year;
      let annualContribution = fortnightlyContribution * TIME_PERIODS.FORTNIGHTS_PER_YEAR;
      
      // Adjust for part-time work
      if (age >= partTimeStartAge && age < inputs.retirementAge) {
        const partTimeRatio = calculatePartTimeRatio(partTimeDays);
        annualContribution *= partTimeRatio;
      }
      
      // Add long service leave contribution (spread over first year)
      if (year === 0 && longServiceDays > 0) {
        // Long service leave is paid as salary, so it contributes to super at employer contribution rate
        const longServiceSuper = calculateLSLSuperContribution(longServiceDays, annualSalary);
        balance += longServiceSuper;
      }
      
      // Calculate growth
      const interestEarned = balance * netReturnRate;
      balance += interestEarned;
      
      // Add contributions (made throughout the year, simplified as year-end)
      balance += annualContribution;
      
      projections.push({
        year,
        age,
        balance: Math.round(balance),
        contributions: annualContribution,
        interest: Math.round(interestEarned),
        isPartTime: age >= partTimeStartAge && age < inputs.retirementAge
      });
    }
    
    return { finalBalance: Math.round(balance), projections };
  };

  const calculateRetirementIncome = (totalBalance) => {
    const yearsInRetirement = inputs.lifeExpectancy - inputs.retirementAge;
    const netReturnRate = calculateNetReturnRate(inputs.returnRate, inputs.adminFees, inputs.inflationRate);
    
    // Calculate sustainable income using present value annuity formula
    // This ensures the balance lasts exactly until life expectancy
    let annualIncome;
    if (netReturnRate !== 0) {
      annualIncome = totalBalance * netReturnRate / (1 - Math.pow(1 + netReturnRate, -yearsInRetirement));
    } else {
      annualIncome = totalBalance / yearsInRetirement;
    }
    
    const retirementProjections = [];
    let balance = totalBalance;
    
    for (let year = 0; year <= yearsInRetirement; year++) {
      const age = inputs.retirementAge + year;
      
      if (year > 0) {
        // Withdraw income
        balance -= annualIncome;
        // Apply growth
        balance *= (1 + netReturnRate);
      }
      
      retirementProjections.push({
        year,
        age,
        balance: Math.round(Math.max(0, balance)),
        withdrawal: year === 0 ? 0 : Math.round(annualIncome)
      });
    }
    
    return {
      annualIncome: Math.round(annualIncome),
      monthlyIncome: Math.round(annualIncome / 12),
      retirementProjections
    };
  };

  const handleCalculate = () => {
    const steveResults = calculateProjection('steve');
    const anneResults = calculateProjection('anne');
    
    const combinedBalance = steveResults.finalBalance + anneResults.finalBalance;
    const retirementIncome = calculateRetirementIncome(combinedBalance);
    
    const scenario = {
      id: Date.now(),
      name: `Scenario ${scenarios.length + 1}`,
      inputs: { ...inputs },
      steve: steveResults,
      anne: anneResults,
      combined: {
        finalBalance: combinedBalance,
        ...retirementIncome
      }
    };
    
    setScenarios([...scenarios, scenario]);
    setShowComparison(true);
  };

  const handleSaveScenario = () => {
    handleCalculate();
  };

  const handleClearScenarios = () => {
    if (window.confirm('Are you sure you want to clear all saved scenarios? This cannot be undone.')) {
      setScenarios([]);
      setShowComparison(false);
      saveData(STORAGE_KEYS.RETIREMENT_SCENARIOS, []);
    }
  };

  const currentScenario = scenarios.length > 0 ? scenarios[scenarios.length - 1] : null;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-AU', { 
      style: 'currency', 
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const yearsToRetirementSteve = calculateYearsToRetirement(steveAge);
  const yearsToRetirementAnne = calculateYearsToRetirement(anneAge);

  return (
    <div className="retirement-planner">
      <h2>Comprehensive Retirement Planner</h2>
      
      <div className="info-box" style={{marginBottom: '20px'}}>
        <h3>Your Details</h3>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
          <div>
            <p><strong>Steve:</strong> Age {steveAge} (DOB: {steveDOB})</p>
            <p>Years to retirement: {yearsToRetirementSteve}</p>
          </div>
          <div>
            <p><strong>Anne:</strong> Age {anneAge} (DOB: {anneDOB})</p>
            <p>Years to retirement: {yearsToRetirementAnne}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Superannuation Details</h3>
        
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px'}}>
          {/* Steve's Details */}
          <div style={{padding: '20px', background: '#f8f9fa', borderRadius: '8px'}}>
            <h4 style={{marginBottom: '15px', color: '#667eea'}}>Steve's Details</h4>
            
            <div className="form-group">
              <label>Current Super Balance ($)</label>
              <input
                type="number"
                name="steveCurrentBalance"
                value={inputs.steveCurrentBalance}
                onChange={handleChange}
                placeholder="Current balance"
              />
            </div>

            <div className="form-group">
              <label>Fortnightly Contribution (before tax) ($)</label>
              <input
                type="number"
                name="steveFortnightlyContribution"
                value={inputs.steveFortnightlyContribution}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Current Annual Salary ($)</label>
              <input
                type="number"
                name="steveCurrentSalary"
                value={inputs.steveCurrentSalary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Long Service Leave Days Available</label>
              <input
                type="number"
                name="steveLongServiceDays"
                value={inputs.steveLongServiceDays}
                onChange={handleChange}
                placeholder="0"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                LSL contributes to super at {SUPER_RATES.EMPLOYER_CONTRIBUTION_PERCENTAGE}% employer rate
              </small>
            </div>

            <div className="form-group">
              <label>Part-Time Work Start Age</label>
              <input
                type="number"
                name="stevePartTimeStartAge"
                value={inputs.stevePartTimeStartAge}
                onChange={handleChange}
                min={steveAge}
                max={inputs.retirementAge}
              />
            </div>

            <div className="form-group">
              <label>Part-Time Days per Week</label>
              <input
                type="number"
                name="stevePartTimeDays"
                value={inputs.stevePartTimeDays}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.5"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                {inputs.stevePartTimeDays < TIME_PERIODS.FULL_TIME_DAYS_PER_WEEK ? `${(calculatePartTimeRatio(inputs.stevePartTimeDays) * 100).toFixed(0)}% of full-time` : 'Full-time'}
              </small>
            </div>
          </div>

          {/* Anne's Details */}
          <div style={{padding: '20px', background: '#f8f9fa', borderRadius: '8px'}}>
            <h4 style={{marginBottom: '15px', color: '#764ba2'}}>Anne's Details</h4>
            
            <div className="form-group">
              <label>Current Super Balance ($)</label>
              <input
                type="number"
                name="anneCurrentBalance"
                value={inputs.anneCurrentBalance}
                onChange={handleChange}
                placeholder="Current balance"
              />
            </div>

            <div className="form-group">
              <label>Fortnightly Contribution (before tax) ($)</label>
              <input
                type="number"
                name="anneFortnightlyContribution"
                value={inputs.anneFortnightlyContribution}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Current Annual Salary ($)</label>
              <input
                type="number"
                name="anneCurrentSalary"
                value={inputs.anneCurrentSalary}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Long Service Leave Days Available</label>
              <input
                type="number"
                name="anneLongServiceDays"
                value={inputs.anneLongServiceDays}
                onChange={handleChange}
                placeholder="0"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                LSL contributes to super at {SUPER_RATES.EMPLOYER_CONTRIBUTION_PERCENTAGE}% employer rate
              </small>
            </div>

            <div className="form-group">
              <label>Part-Time Work Start Age</label>
              <input
                type="number"
                name="annePartTimeStartAge"
                value={inputs.annePartTimeStartAge}
                onChange={handleChange}
                min={anneAge}
                max={inputs.retirementAge}
              />
            </div>

            <div className="form-group">
              <label>Part-Time Days per Week</label>
              <input
                type="number"
                name="annePartTimeDays"
                value={inputs.annePartTimeDays}
                onChange={handleChange}
                min="1"
                max="5"
                step="0.5"
              />
              <small style={{color: '#666', fontSize: '12px'}}>
                {inputs.annePartTimeDays < TIME_PERIODS.FULL_TIME_DAYS_PER_WEEK ? `${(calculatePartTimeRatio(inputs.annePartTimeDays) * 100).toFixed(0)}% of full-time` : 'Full-time'}
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{marginTop: '20px'}}>
        <h3>Investment & Retirement Assumptions</h3>
        <div className="grid-2" style={{marginTop: '15px'}}>
          <div className="form-group">
            <label>Expected Annual Return (%)</label>
            <input
              type="number"
              step="0.1"
              name="returnRate"
              value={inputs.returnRate}
              onChange={handleChange}
            />
            <small style={{color: '#666', fontSize: '12px'}}>
              Typical balanced fund: 6-8% p.a.
            </small>
          </div>

          <div className="form-group">
            <label>Annual Inflation Rate (%)</label>
            <input
              type="number"
              step="0.1"
              name="inflationRate"
              value={inputs.inflationRate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Annual Admin Fees (%)</label>
            <input
              type="number"
              step="0.1"
              name="adminFees"
              value={inputs.adminFees}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Target Retirement Age</label>
            <input
              type="number"
              name="retirementAge"
              value={inputs.retirementAge}
              onChange={handleChange}
              min={Math.max(steveAge, anneAge)}
              max="70"
            />
          </div>

          <div className="form-group">
            <label>Life Expectancy</label>
            <input
              type="number"
              name="lifeExpectancy"
              value={inputs.lifeExpectancy}
              onChange={handleChange}
              min={inputs.retirementAge + 1}
              max="100"
            />
          </div>

          <div className="form-group">
            <label>Desired Annual Income in Retirement ($)</label>
            <input
              type="number"
              name="desiredAnnualIncome"
              value={inputs.desiredAnnualIncome}
              onChange={handleChange}
              step="1000"
            />
          </div>
        </div>
      </div>

      <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
        <button onClick={handleCalculate} className="btn-primary">
          Calculate Projection
        </button>
        <button onClick={handleSaveScenario} className="btn-secondary">
          Save as Scenario
        </button>
        {scenarios.length > 0 && (
          <button onClick={handleClearScenarios} className="btn-secondary">
            Clear All Scenarios
          </button>
        )}
      </div>

      {/* Current Results */}
      {currentScenario && (
        <>
          <div className="result-card" style={{marginTop: '30px'}}>
            <h3>Projection Results at Retirement (Age {inputs.retirementAge})</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '20px'}}>
              <div className="stat-card" style={{background: '#667eea', color: 'white'}}>
                <div className="stat-label">Steve's Balance</div>
                <div className="stat-value">{formatCurrency(currentScenario.steve.finalBalance)}</div>
              </div>
              
              <div className="stat-card" style={{background: '#764ba2', color: 'white'}}>
                <div className="stat-label">Anne's Balance</div>
                <div className="stat-value">{formatCurrency(currentScenario.anne.finalBalance)}</div>
              </div>
              
              <div className="stat-card" style={{background: '#48bb78', color: 'white'}}>
                <div className="stat-label">Combined Total</div>
                <div className="stat-value">{formatCurrency(currentScenario.combined.finalBalance)}</div>
              </div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px'}}>
              <div className="stat-card">
                <div className="stat-label">Sustainable Annual Income</div>
                <div className="stat-value">{formatCurrency(currentScenario.combined.annualIncome)}</div>
                <small style={{color: '#666'}}>Until age {inputs.lifeExpectancy}</small>
              </div>
              
              <div className="stat-card">
                <div className="stat-label">Monthly Income</div>
                <div className="stat-value">{formatCurrency(currentScenario.combined.monthlyIncome)}</div>
              </div>
            </div>

            {currentScenario.combined.annualIncome < inputs.desiredAnnualIncome && (
              <div className="info-box" style={{marginTop: '20px', background: '#fff3cd', borderColor: '#ffc107'}}>
                <p style={{margin: 0, color: '#856404'}}>
                  <strong>⚠️ Income Shortfall:</strong> Your projected income of {formatCurrency(currentScenario.combined.annualIncome)} 
                  is {formatCurrency(inputs.desiredAnnualIncome - currentScenario.combined.annualIncome)} below 
                  your desired income of {formatCurrency(inputs.desiredAnnualIncome)}. 
                  Consider increasing contributions, working longer, or adjusting retirement income expectations.
                </p>
              </div>
            )}

            {currentScenario.combined.annualIncome >= inputs.desiredAnnualIncome && (
              <div className="info-box" style={{marginTop: '20px', background: '#d4edda', borderColor: '#28a745'}}>
                <p style={{margin: 0, color: '#155724'}}>
                  <strong>✓ Income Target Met:</strong> Your projected income of {formatCurrency(currentScenario.combined.annualIncome)} 
                  exceeds your desired income of {formatCurrency(inputs.desiredAnnualIncome)} 
                  by {formatCurrency(currentScenario.combined.annualIncome - inputs.desiredAnnualIncome)} per year!
                </p>
              </div>
            )}
          </div>

          {/* Growth Projection Chart */}
          <div className="card" style={{marginTop: '30px'}}>
            <h3>Superannuation Growth to Retirement</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="age" 
                  type="number"
                  domain={[Math.min(steveAge, anneAge), inputs.retirementAge]}
                  label={{ value: 'Age', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(age) => `Age ${age}`}
                />
                <Legend />
                <Line 
                  data={currentScenario.steve.projections} 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#667eea" 
                  strokeWidth={3} 
                  name="Steve's Balance" 
                  dot={false}
                />
                <Line 
                  data={currentScenario.anne.projections} 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#764ba2" 
                  strokeWidth={3} 
                  name="Anne's Balance" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Retirement Drawdown Chart */}
          <div className="card" style={{marginTop: '30px'}}>
            <h3>Retirement Balance Drawdown</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={currentScenario.combined.retirementProjections}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="age" 
                  label={{ value: 'Age', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value) => formatCurrency(value)}
                  labelFormatter={(age) => `Age ${age}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#48bb78" 
                  strokeWidth={3} 
                  name="Remaining Balance" 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
            <p style={{marginTop: '15px', color: '#666', textAlign: 'center'}}>
              Withdrawing {formatCurrency(currentScenario.combined.annualIncome)} annually 
              (real terms, accounting for {inputs.returnRate - inputs.adminFees - inputs.inflationRate}% net growth after inflation)
            </p>
          </div>

          {/* Long Service Leave & Part-Time Impact */}
          {(inputs.steveLongServiceDays > 0 || inputs.anneLongServiceDays > 0 || 
            inputs.stevePartTimeDays < 5 || inputs.annePartTimeDays < 5) && (
            <div className="info-box" style={{marginTop: '30px'}}>
              <h3>Work Transition Impact</h3>
              
              {inputs.steveLongServiceDays > 0 && (
                <p>
                  <strong>Steve's Long Service Leave:</strong> {inputs.steveLongServiceDays} days 
                  adds approximately {formatCurrency(calculateLSLSuperContribution(inputs.steveLongServiceDays, inputs.steveCurrentSalary))} 
                  to superannuation ({SUPER_RATES.EMPLOYER_CONTRIBUTION_PERCENTAGE}% employer contribution).
                </p>
              )}
              
              {inputs.anneLongServiceDays > 0 && (
                <p>
                  <strong>Anne's Long Service Leave:</strong> {inputs.anneLongServiceDays} days 
                  adds approximately {formatCurrency(calculateLSLSuperContribution(inputs.anneLongServiceDays, inputs.anneCurrentSalary))} 
                  to superannuation ({SUPER_RATES.EMPLOYER_CONTRIBUTION_PERCENTAGE}% employer contribution).
                </p>
              )}
              
              {inputs.stevePartTimeDays < TIME_PERIODS.FULL_TIME_DAYS_PER_WEEK && inputs.stevePartTimeStartAge < inputs.retirementAge && (
                <p>
                  <strong>Steve's Part-Time Work:</strong> Reducing to {inputs.stevePartTimeDays} days/week 
                  from age {inputs.stevePartTimeStartAge} reduces contributions to {(calculatePartTimeRatio(inputs.stevePartTimeDays) * 100).toFixed(0)}% 
                  for {inputs.retirementAge - inputs.stevePartTimeStartAge} year(s).
                </p>
              )}
              
              {inputs.annePartTimeDays < TIME_PERIODS.FULL_TIME_DAYS_PER_WEEK && inputs.annePartTimeStartAge < inputs.retirementAge && (
                <p>
                  <strong>Anne's Part-Time Work:</strong> Reducing to {inputs.annePartTimeDays} days/week 
                  from age {inputs.annePartTimeStartAge} reduces contributions to {(calculatePartTimeRatio(inputs.annePartTimeDays) * 100).toFixed(0)}% 
                  for {inputs.retirementAge - inputs.annePartTimeStartAge} year(s).
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Scenario Comparison */}
      {scenarios.length > 1 && showComparison && (
        <div className="card" style={{marginTop: '30px'}}>
          <h3>Scenario Comparison</h3>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', marginTop: '20px'}}>
              <thead>
                <tr style={{background: '#f8f9fa', borderBottom: '2px solid #dee2e6'}}>
                  <th style={{padding: '12px', textAlign: 'left'}}>Scenario</th>
                  <th style={{padding: '12px', textAlign: 'right'}}>Steve's Balance</th>
                  <th style={{padding: '12px', textAlign: 'right'}}>Anne's Balance</th>
                  <th style={{padding: '12px', textAlign: 'right'}}>Combined Total</th>
                  <th style={{padding: '12px', textAlign: 'right'}}>Annual Income</th>
                  <th style={{padding: '12px', textAlign: 'center'}}>Details</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, index) => (
                  <tr key={scenario.id} style={{borderBottom: '1px solid #dee2e6'}}>
                    <td style={{padding: '12px'}}>
                      <strong>{scenario.name}</strong>
                    </td>
                    <td style={{padding: '12px', textAlign: 'right'}}>
                      {formatCurrency(scenario.steve.finalBalance)}
                    </td>
                    <td style={{padding: '12px', textAlign: 'right'}}>
                      {formatCurrency(scenario.anne.finalBalance)}
                    </td>
                    <td style={{padding: '12px', textAlign: 'right', fontWeight: 'bold'}}>
                      {formatCurrency(scenario.combined.finalBalance)}
                    </td>
                    <td style={{padding: '12px', textAlign: 'right', fontWeight: 'bold', color: '#48bb78'}}>
                      {formatCurrency(scenario.combined.annualIncome)}
                    </td>
                    <td style={{padding: '12px', textAlign: 'center'}}>
                      <button 
                        onClick={() => {
                          const details = `
Steve: LSL ${scenario.inputs.steveLongServiceDays} days, Part-time from age ${scenario.inputs.stevePartTimeStartAge} (${scenario.inputs.stevePartTimeDays} days/week)
Anne: LSL ${scenario.inputs.anneLongServiceDays} days, Part-time from age ${scenario.inputs.annePartTimeStartAge} (${scenario.inputs.annePartTimeDays} days/week)
Retirement Age: ${scenario.inputs.retirementAge}
Return Rate: ${scenario.inputs.returnRate}%
                          `.trim();
                          alert(details);
                        }}
                        style={{padding: '5px 10px', fontSize: '12px'}}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{marginTop: '30px'}}>
            <h4>Balance Comparison Chart</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scenarios.map((s, i) => ({
                name: `Scenario ${i + 1}`,
                steve: s.steve.finalBalance,
                anne: s.anne.finalBalance,
                total: s.combined.finalBalance
              }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="steve" fill="#667eea" name="Steve" />
                <Bar dataKey="anne" fill="#764ba2" name="Anne" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Educational Information */}
      <div className="info-box" style={{marginTop: '30px'}}>
        <h3>Using This Retirement Planner</h3>
        <h4>Long Service Leave Strategy</h4>
        <p>
          Long service leave is paid as ordinary salary, which means your employer will make the {SUPER_RATES.EMPLOYER_CONTRIBUTION_PERCENTAGE}% 
          superannuation guarantee contribution on this payment. Taking LSL before retirement can boost 
          your super balance. Enter your available LSL days to see the impact.
        </p>
        
        <h4>Part-Time Work Transition</h4>
        <p>
          Many people transition to part-time work before full retirement. This calculator lets you model 
          reducing your work days (e.g., from 5 to 4 or 3 days per week) at a specific age. This helps you 
          understand the trade-off between enjoying more free time now versus higher retirement savings.
        </p>
        
        <h4>Scenario Comparison</h4>
        <p>
          Save multiple scenarios to compare different strategies:
        </p>
        <ul>
          <li>Full-time until 60 vs. part-time from 58</li>
          <li>Taking LSL early vs. spreading it out</li>
          <li>Different retirement ages (58, 60, 62)</li>
          <li>Various contribution levels</li>
        </ul>
        
        <h4>Tax Considerations</h4>
        <p>
          <strong>Before-tax (salary sacrifice) contributions:</strong> Your $500 fortnightly contributions 
          are before-tax, meaning they reduce your taxable income while building your super. This is 
          highly tax-effective, especially if you're in a higher tax bracket.
        </p>
        <p>
          <strong>Retirement phase:</strong> After age {AGE_THRESHOLDS.TAX_FREE_WITHDRAWAL_AGE}, withdrawals from your super are generally tax-free. 
          This calculator shows sustainable income in today's dollars, adjusted for inflation.
        </p>
      </div>

      <div className="info-box" style={{marginTop: '20px', background: '#fff3cd', borderColor: '#ffc107'}}>
        <p style={{margin: 0, color: '#856404'}}>
          <strong>Important Disclaimer:</strong> This calculator provides estimates based on your inputs 
          and assumptions. Actual investment returns will vary, and past performance doesn't guarantee 
          future results. Consider seeking advice from a licensed financial adviser for personalised 
          retirement planning. Don't forget to factor in the Age Pension, which may supplement your super income.
        </p>
      </div>
    </div>
  );
}

export default RetirementPlanner;
