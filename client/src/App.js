import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import ProjectionCalculator from './components/ProjectionCalculator';
import RetirementIncome from './components/RetirementIncome';
import TaxBenefits from './components/TaxBenefits';
import MinimumDrawdown from './components/MinimumDrawdown';
import RetirementPlanner from './components/RetirementPlanner';
import { saveData, loadData, clearAllData, exportAllData, importAllData, isStorageAvailable, STORAGE_KEYS } from './utils/dataStorage';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    // Load last active tab on initial render
    return loadData(STORAGE_KEYS.LAST_ACTIVE_TAB, 'dashboard');
  });
  const [showDataMenu, setShowDataMenu] = useState(false);

  // Save active tab whenever it changes
  useEffect(() => {
    saveData(STORAGE_KEYS.LAST_ACTIVE_TAB, activeTab);
  }, [activeTab]);

  const handleBackToFinance = () => {
    // Check if we're in a popup/new tab and can close it
    if (window.opener) {
      window.close();
    } else {
      // Navigate back to the finance app
      const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      if (isLocal) {
        // In development, go back to the local server
        window.location.href = 'http://localhost:5000';
      } else {
        // In production, go back to the main Budget app (parent directory)
        // Current URL: https://stevencowell.github.io/Budget---old-2/app/
        // Target URL: https://stevencowell.github.io/Budget---old-2/
        const currentPath = window.location.pathname;
        const parentPath = currentPath.replace(/\/app\/?$/, '/');
        window.location.href = window.location.origin + parentPath;
      }
    }
  };

  const handleExportData = () => {
    try {
      const data = exportAllData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `superannuation-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      alert('Data exported successfully!');
    } catch (error) {
      alert('Error exporting data. Please try again.');
    }
  };

  const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target.result);
            if (window.confirm('This will overwrite all current data. Continue?')) {
              importAllData(data);
              alert('Data imported successfully! Reloading page...');
              window.location.reload();
            }
          } catch (error) {
            alert('Error importing data. Please ensure the file is valid.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear ALL saved data? This cannot be undone.')) {
      if (window.confirm('This is your final warning. All data will be permanently deleted. Continue?')) {
        clearAllData();
        alert('All data cleared. Reloading page...');
        window.location.reload();
      }
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>🏦 Superannuation Tracker</h1>
            <p>Track and project your retirement savings {isStorageAvailable() && '💾 Auto-saving enabled'}</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <button 
                className="back-button" 
                onClick={() => setShowDataMenu(!showDataMenu)} 
                title="Data Management"
                style={{ marginRight: '10px' }}
              >
                ⚙️ Data
              </button>
              {showDataMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: '0',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  zIndex: 1000,
                  minWidth: '200px',
                  marginTop: '5px'
                }}>
                  <button
                    onClick={() => { handleExportData(); setShowDataMenu(false); }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    📤 Export Data
                  </button>
                  <button
                    onClick={() => { handleImportData(); setShowDataMenu(false); }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    📥 Import Data
                  </button>
                  <button
                    onClick={() => { handleClearAllData(); setShowDataMenu(false); }}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '12px 16px',
                      border: 'none',
                      background: 'none',
                      textAlign: 'left',
                      cursor: 'pointer',
                      color: '#d32f2f'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#ffebee'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    🗑️ Clear All Data
                  </button>
                </div>
              )}
            </div>
            <button className="back-button" onClick={handleBackToFinance} title="Back to Finance App">
              ← Back to Finance
            </button>
          </div>
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
        <p>© 2025 Superannuation Tracker - For informational purposes only. Consult a financial adviser for personalised advice.</p>
      </footer>
    </div>
  );
}

export default App;
