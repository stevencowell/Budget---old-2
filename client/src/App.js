import React, { useState } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ProjectionCalculator from './components/ProjectionCalculator';
import RetirementIncome from './components/RetirementIncome';
import TaxBenefits from './components/TaxBenefits';
import MinimumDrawdown from './components/MinimumDrawdown';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="App">
      <header className="app-header">
        <h1>🏦 Superannuation Tracker</h1>
        <p>Track and project your retirement savings</p>
      </header>

      <nav className="nav-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
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
