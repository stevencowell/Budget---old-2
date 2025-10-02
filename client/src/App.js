import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ProjectionCalculator from './components/ProjectionCalculator';
import RetirementIncome from './components/RetirementIncome';
import TaxBenefits from './components/TaxBenefits';
import MinimumDrawdown from './components/MinimumDrawdown';
import RetirementPlanner from './components/RetirementPlanner';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleBackToFinance = () => {
    // Check if we're in a popup/new tab and can close it
    if (window.opener) {
      window.close();
    } else {
      // If we can't close (user navigated directly), try to go back to the finance app
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const financeAppUrl = isLocal ? 'http://localhost:5000' : window.location.origin;
      window.location.href = financeAppUrl;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🏦 Superannuation Tracker</h1>
            <p>Track and project your retirement savings</p>
          </div>
          <button className="back-button" onClick={handleBackToFinance} title="Back to Finance App">
            ← Back to Finance
          </button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={activeTab === 'planner' ? 'active' : ''} 
          onClick={() => setActiveTab('planner')}
        >
          Retirement Planner
        </button>
        <button 
          className={activeTab === 'projection' ? 'active' : ''} 
          onClick={() => setActiveTab('projection')}
        >
          Projection Calculator
        </button>
        <button 
          className={activeTab === 'retirement' ? 'active' : ''} 
          onClick={() => setActiveTab('retirement')}
        >
          Retirement Income
        </button>
        <button 
          className={activeTab === 'tax' ? 'active' : ''} 
          onClick={() => setActiveTab('tax')}
        >
          Tax Benefits
        </button>
        <button 
          className={activeTab === 'drawdown' ? 'active' : ''} 
          onClick={() => setActiveTab('drawdown')}
        >
          Minimum Drawdown
        </button>
      </nav>

      <main className="main-content">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'planner' && <RetirementPlanner />}
        {activeTab === 'projection' && <ProjectionCalculator />}
        {activeTab === 'retirement' && <RetirementIncome />}
        {activeTab === 'tax' && <TaxBenefits />}
        {activeTab === 'drawdown' && <MinimumDrawdown />}
      </main>

      <footer className="app-footer">
        <p>© 2025 Superannuation Tracker - For informational purposes only. Consult a financial advisor for personalized advice.</p>
      </footer>
    </div>
  );
}

export default App;
