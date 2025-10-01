const currency = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  maximumFractionDigits: 0,
});

const currencyPrecise = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 2,
});

// ==================== Data Loading ====================

function readInlineFinancialData() {
  const el = document.getElementById('financialData');
  if (!el) return null;
  const content = el.textContent?.trim();
  if (!content) return null;

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('Unable to parse inline financial data', error);
    return null;
  }
}

function buildCandidateDataPaths() {
  const paths = new Set();
  const inlineEl = document.getElementById('financialData');
  const scriptEl = document.querySelector('script[data-json-path]');

  const inlineSrc = inlineEl?.getAttribute('data-src');
  const scriptPath = scriptEl?.getAttribute('data-json-path');

  if (inlineSrc) paths.add(inlineSrc);
  if (scriptPath) paths.add(scriptPath);

  ['./financial_overview.json', './data/financial_overview.json', '../data/financial_overview.json', '../../data/financial_overview.json'].forEach(
    (path) => paths.add(path),
  );

  const { origin, pathname } = window.location;
  const segments = pathname.split('/').filter(Boolean);
  const suffixes = ['financial_overview.json', 'data/financial_overview.json'];

  for (let i = segments.length; i >= 0; i--) {
    const baseSegments = segments.slice(0, i);
    suffixes.forEach((suffix) => {
      const joined = [...baseSegments, suffix].join('/');
      paths.add(`${origin}/${joined}`);
    });
  }

  return Array.from(paths).filter(Boolean);
}

async function loadData() {
  const inlineData = readInlineFinancialData();
  if (inlineData) {
    return inlineData;
  }

  const candidatePaths = buildCandidateDataPaths();

  for (const path of candidatePaths) {
    try {
      const response = await fetch(path);
      if (response.ok) {
        return await response.json();
      }
      console.warn(`Received ${response.status} when loading financial_overview.json from ${path}`);
    } catch (error) {
      console.warn(`Failed to load financial_overview.json from ${path}`, error);
    }
  }

  throw new Error('Unable to load financial_overview.json');
}

// ==================== Storage Management ====================

class StorageManager {
  constructor() {
    this.prefix = 'cowell_budget_';
  }

  getBudgetItems() {
    const saved = localStorage.getItem(this.prefix + 'budget_items');
    return saved ? JSON.parse(saved) : null;
  }

  saveBudgetItems(items) {
    localStorage.setItem(this.prefix + 'budget_items', JSON.stringify(items));
  }

  resetBudgetItems() {
    localStorage.removeItem(this.prefix + 'budget_items');
  }

  getScenarios() {
    const saved = localStorage.getItem(this.prefix + 'scenarios');
    return saved ? JSON.parse(saved) : [];
  }

  saveScenarios(scenarios) {
    localStorage.setItem(this.prefix + 'scenarios', JSON.stringify(scenarios));
  }
}

const storage = new StorageManager();

// ==================== Navigation ====================

function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  const views = document.querySelectorAll('.view');

  navButtons.forEach(button => {
    button.addEventListener('click', () => {
      const viewId = button.getAttribute('data-view');
      
      navButtons.forEach(btn => btn.classList.remove('active'));
      views.forEach(view => view.classList.remove('active'));
      
      button.classList.add('active');
      document.getElementById(`${viewId}-view`).classList.add('active');
    });
  });
}

// ==================== Chart Utilities ====================

let chartInstances = {};

function destroyChart(chartId) {
  if (chartInstances[chartId]) {
    chartInstances[chartId].destroy();
    delete chartInstances[chartId];
  }
}

function createLineChart(canvasId, labels, datasets, options = {}) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  chartInstances[canvasId] = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#f8fafc' }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        y: {
          ticks: { 
            color: '#94a3b8',
            callback: (value) => currency.format(value)
          },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        }
      },
      ...options
    }
  });
}

function createPieChart(canvasId, labels, data, options = {}) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  chartInstances[canvasId] = new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          'rgba(56, 189, 248, 0.8)',
          'rgba(74, 222, 128, 0.8)',
          'rgba(251, 146, 60, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(250, 204, 21, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(248, 113, 113, 0.8)',
        ],
        borderColor: 'rgba(15, 23, 42, 0.8)',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right',
          labels: { color: '#f8fafc', padding: 15 }
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const label = context.label || '';
              const value = currency.format(context.parsed);
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((context.parsed / total) * 100).toFixed(1);
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      },
      ...options
    }
  });
}

function createBarChart(canvasId, labels, datasets, options = {}) {
  destroyChart(canvasId);
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;

  chartInstances[canvasId] = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: { color: '#f8fafc' }
        }
      },
      scales: {
        x: {
          ticks: { color: '#94a3b8' },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        },
        y: {
          ticks: { 
            color: '#94a3b8',
            callback: (value) => currency.format(value)
          },
          grid: { color: 'rgba(148, 163, 184, 0.1)' }
        }
      },
      ...options
    }
  });
}

// ==================== Overview View ====================

// Global state for overview filters
let overviewFilterState = {
  period: 'all',
  dateFrom: null,
  dateTo: null,
  originalData: null
};

function filterMonthlyCashflow(monthlyCashflow) {
  if (overviewFilterState.period === 'all') {
    return monthlyCashflow;
  }

  const now = new Date();
  let startDate = null;

  switch (overviewFilterState.period) {
    case 'last12':
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 12);
      break;
    case 'last6':
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case 'last3':
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 3);
      break;
    case 'ytd':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case 'custom':
      if (overviewFilterState.dateFrom || overviewFilterState.dateTo) {
        return monthlyCashflow.filter(m => {
          const monthStr = m.month;
          if (overviewFilterState.dateFrom && monthStr < overviewFilterState.dateFrom) return false;
          if (overviewFilterState.dateTo && monthStr > overviewFilterState.dateTo) return false;
          return true;
        });
      }
      return monthlyCashflow;
  }

  if (startDate) {
    const startMonthStr = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;
    return monthlyCashflow.filter(m => m.month >= startMonthStr);
  }

  return monthlyCashflow;
}

function filterTransactionsByDateRange(transactions) {
  if (overviewFilterState.period === 'all') {
    return transactions;
  }

  const filtered = filterMonthlyCashflow(
    overviewFilterState.originalData.monthly_cashflow
  );
  
  const allowedMonths = new Set(filtered.map(m => m.month));
  
  return transactions.filter(tx => {
    const txMonth = tx.date.substring(0, 7); // Extract YYYY-MM
    return allowedMonths.has(txMonth);
  });
}

function recalculateMetrics(monthlyCashflow, transactions) {
  const totalIncome = monthlyCashflow.reduce((sum, m) => sum + m.income, 0);
  const totalExpense = monthlyCashflow.reduce((sum, m) => sum + Math.abs(m.expenses), 0);
  const netPosition = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netPosition / totalIncome) * 100) : 0;
  const averageMonthlyNet = monthlyCashflow.length > 0 ? netPosition / monthlyCashflow.length : 0;

  // Calculate essential vs discretionary (simplified)
  const essentialCategories = ['Housing & Utilities', 'Health & Insurance', 'Groceries & Dining'];
  let essentialAnnual = 0;
  let discretionaryAnnual = 0;

  transactions.forEach(tx => {
    if (tx.amount < 0) {
      const absAmount = Math.abs(tx.amount);
      if (essentialCategories.includes(tx.category)) {
        essentialAnnual += absAmount;
      } else {
        discretionaryAnnual += absAmount;
      }
    }
  });

  return {
    total_income: totalIncome,
    total_expense: totalExpense,
    net_position: netPosition,
    savings_rate: savingsRate,
    average_monthly_net: averageMonthlyNet,
    essential_annual: essentialAnnual,
    discretionary_annual: discretionaryAnnual
  };
}

function recalculateCategorySummary(transactions) {
  const categoryMap = new Map();

  transactions.forEach(tx => {
    if (!categoryMap.has(tx.category)) {
      categoryMap.set(tx.category, { category: tx.category, income: 0, expense: 0, net: 0 });
    }
    const cat = categoryMap.get(tx.category);
    if (tx.amount > 0) {
      cat.income += tx.amount;
    } else {
      cat.expense += Math.abs(tx.amount);
    }
    cat.net = cat.income - cat.expense;
  });

  return Array.from(categoryMap.values());
}

function recalculateTopMerchants(transactions) {
  const merchantMap = new Map();

  transactions.forEach(tx => {
    if (tx.amount < 0 && tx.description) {
      const merchant = tx.description;
      merchantMap.set(merchant, (merchantMap.get(merchant) || 0) + Math.abs(tx.amount));
    }
  });

  return Array.from(merchantMap.entries())
    .map(([merchant, total]) => ({ merchant, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

function recalculateTopIncome(transactions) {
  const incomeMap = new Map();

  transactions.forEach(tx => {
    if (tx.amount > 0 && tx.category) {
      incomeMap.set(tx.category, (incomeMap.get(tx.category) || 0) + tx.amount);
    }
  });

  return Array.from(incomeMap.entries())
    .map(([merchant, total]) => ({ merchant, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);
}

function refreshOverview() {
  if (!overviewFilterState.originalData) return;

  const filteredMonthlyCashflow = filterMonthlyCashflow(overviewFilterState.originalData.monthly_cashflow);
  const filteredTransactions = filterTransactionsByDateRange(overviewFilterState.originalData.recent_transactions);
  const recalculatedMetrics = recalculateMetrics(filteredMonthlyCashflow, filteredTransactions);
  const recalculatedCategories = recalculateCategorySummary(filteredTransactions);
  const recalculatedMerchants = recalculateTopMerchants(filteredTransactions);
  const recalculatedIncome = recalculateTopIncome(filteredTransactions);

  // Update all overview components
  renderSummary(recalculatedMetrics, overviewFilterState.originalData.calc_defaults);
  renderMonthlyTrendChart(filteredMonthlyCashflow);
  renderCategoryPieChart(recalculatedCategories);
  renderCategoryBars(recalculatedCategories.filter((row) => row.category !== 'Transfers'), filteredTransactions);
  renderRankList(recalculatedMerchants, 'merchantList');
  renderIncomeList(recalculatedIncome);

  // Update the period selector to show number of months
  updatePeriodLabel(filteredMonthlyCashflow.length);
}

function updatePeriodLabel(monthCount) {
  const periodFilter = document.getElementById('overviewPeriodFilter');
  if (periodFilter && overviewFilterState.period === 'all') {
    const allOption = periodFilter.querySelector('option[value="all"]');
    if (allOption) {
      allOption.textContent = `All Time (${monthCount} months)`;
    }
  }
}

function initOverviewFilters(data) {
  overviewFilterState.originalData = data;

  const periodFilter = document.getElementById('overviewPeriodFilter');
  const customDateRange = document.getElementById('customDateRange');
  const dateFromInput = document.getElementById('overviewDateFrom');
  const dateToInput = document.getElementById('overviewDateTo');
  const clearBtn = document.getElementById('clearOverviewFilters');

  if (!periodFilter) return;

  // Set default values for date inputs
  const months = data.monthly_cashflow.map(m => m.month).sort();
  if (months.length > 0) {
    if (dateFromInput) dateFromInput.value = months[0];
    if (dateToInput) dateToInput.value = months[months.length - 1];
  }

  periodFilter.addEventListener('change', (e) => {
    overviewFilterState.period = e.target.value;
    
    if (customDateRange) {
      customDateRange.style.display = e.target.value === 'custom' ? 'flex' : 'none';
    }

    if (e.target.value !== 'custom') {
      refreshOverview();
    }
  });

  if (dateFromInput) {
    dateFromInput.addEventListener('change', (e) => {
      overviewFilterState.dateFrom = e.target.value;
      if (overviewFilterState.period === 'custom') {
        refreshOverview();
      }
    });
  }

  if (dateToInput) {
    dateToInput.addEventListener('change', (e) => {
      overviewFilterState.dateTo = e.target.value;
      if (overviewFilterState.period === 'custom') {
        refreshOverview();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      overviewFilterState.period = 'all';
      overviewFilterState.dateFrom = null;
      overviewFilterState.dateTo = null;
      periodFilter.value = 'all';
      if (customDateRange) customDateRange.style.display = 'none';
      if (dateFromInput && months.length > 0) dateFromInput.value = months[0];
      if (dateToInput && months.length > 0) dateToInput.value = months[months.length - 1];
      refreshOverview();
    });
  }

  updatePeriodLabel(data.monthly_cashflow.length);
}

function updateGeneratedTime(timestamp) {
  const el = document.getElementById('generatedTime');
  if (!el) return;
  const date = new Date(timestamp);
  el.textContent = `Updated ${date.toLocaleString('en-AU', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

function renderSummary(metrics, calcDefaults) {
  const container = document.getElementById('summaryCards');
  if (!container) return;
  const cards = [
    {
      title: 'Household income (12 mths)',
      value: currency.format(metrics.total_income),
      trend: `Avg monthly surplus ${currencyPrecise.format(metrics.average_monthly_net)}`,
    },
    {
      title: 'Total spending (12 mths)',
      value: currency.format(metrics.total_expense),
      trend: `Essential share ${currency.format(metrics.essential_annual)}`,
    },
    {
      title: 'Net position',
      value: currency.format(metrics.net_position),
      trend: `Savings rate ${metrics.savings_rate.toFixed(1)}%`,
    },
    {
      title: 'Airbnb net cash',
      value: currency.format(calcDefaults.airbnb_income - calcDefaults.airbnb_expense),
      trend: `Income ${currency.format(calcDefaults.airbnb_income)} | Expenses ${currency.format(calcDefaults.airbnb_expense)}`,
    },
  ];
  container.innerHTML = cards
    .map(
      (card) => `
        <article class="summary-card">
          <h3>${card.title}</h3>
          <div class="value">${card.value}</div>
          <div class="trend">${card.trend}</div>
        </article>
      `,
    )
    .join('');
}

function renderMonthlyTrendChart(monthly) {
  const labels = monthly.map(m => {
    const date = new Date(m.month + '-01');
    return date.toLocaleDateString('en-AU', { month: 'short', year: '2-digit' });
  });
  const incomeData = monthly.map(m => m.income);
  const expenseData = monthly.map(m => m.expenses);
  const netData = monthly.map(m => m.net);

  const datasets = [
    {
      label: 'Income',
      data: incomeData,
      borderColor: 'rgba(74, 222, 128, 1)',
      backgroundColor: 'rgba(74, 222, 128, 0.1)',
      tension: 0.3,
      hidden: false
    },
    {
      label: 'Expenses',
      data: expenseData,
      borderColor: 'rgba(251, 146, 60, 1)',
      backgroundColor: 'rgba(251, 146, 60, 0.1)',
      tension: 0.3,
      hidden: false
    },
    {
      label: 'Net',
      data: netData,
      borderColor: 'rgba(56, 189, 248, 1)',
      backgroundColor: 'rgba(56, 189, 248, 0.1)',
      tension: 0.3,
      hidden: false
    }
  ];

  createLineChart('monthlyTrendChart', labels, datasets);

  // Add chart controls
  const controls = ['showIncome', 'showExpenses', 'showNet'];
  controls.forEach((id, index) => {
    const checkbox = document.getElementById(id);
    if (checkbox) {
      checkbox.addEventListener('change', () => {
        chartInstances['monthlyTrendChart'].data.datasets[index].hidden = !checkbox.checked;
        chartInstances['monthlyTrendChart'].update();
      });
    }
  });
}

function renderCategoryPieChart(categories) {
  const expenseCategories = categories
    .filter(c => c.expense > 0 && c.category !== 'Transfers')
    .sort((a, b) => b.expense - a.expense)
    .slice(0, 8);
  
  const labels = expenseCategories.map(c => c.category);
  const data = expenseCategories.map(c => c.expense);

  createPieChart('categoryPieChart', labels, data);
}

function renderCategoryBars(rows, allTransactions) {
  const container = document.getElementById('categoryBars');
  if (!container) return;
  const totals = rows.map((row) => Math.max(row.expense, row.income));
  const max = Math.max(...totals, 1);
  container.innerHTML = rows
    .map((row) => {
      const magnitude = Math.max(row.expense, row.income);
      const percentage = ((magnitude / max) * 100).toFixed(1);
      const label = `${row.category}`;
      const detail = row.expense >= row.income
        ? `${currency.format(row.expense)} spent`
        : `${currency.format(row.income)} received`;
      return `
        <div class="bar-item clickable" role="listitem" data-category="${row.category}" style="cursor: pointer;">
          <div class="bar-label">
            <span>${label}</span>
            <span>${detail}</span>
          </div>
          <div class="bar-visual" aria-hidden="true">
            <span style="width: ${percentage}%;"></span>
          </div>
        </div>
      `;
    })
    .join('');
  
  // Add click handlers to show transaction details
  container.querySelectorAll('.bar-item').forEach(item => {
    item.addEventListener('click', () => {
      const category = item.dataset.category;
      showCategoryTransactionDetails(category, rows, allTransactions);
    });
  });
}

function showCategoryTransactionDetails(category, categorySummary, allTransactions) {
  // Filter transactions for this category
  const categoryTransactions = allTransactions.filter(tx => tx.category === category);
  
  // Find the category summary
  const summary = categorySummary.find(cat => cat.category === category);
  
  // Create a modal/popup to display the details
  const modal = document.createElement('div');
  modal.className = 'transaction-detail-modal';
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>${category}</h2>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="category-summary-stats">
          <div class="stat-box">
            <div class="stat-label">Total Income</div>
            <div class="stat-value positive">${currency.format(summary?.income || 0)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Total Expenses</div>
            <div class="stat-value negative">${currency.format(summary?.expense || 0)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Net</div>
            <div class="stat-value ${(summary?.net || 0) >= 0 ? 'positive' : 'negative'}">${currency.format(summary?.net || 0)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Transactions</div>
            <div class="stat-value">${categoryTransactions.length}</div>
          </div>
        </div>
        <div class="transaction-detail-list">
          <h3>Transaction Details</h3>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Subcategory</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${categoryTransactions
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map(tx => {
                    const amountClass = tx.amount < 0 ? 'variance-negative' : 'variance-positive';
                    return `
                      <tr>
                        <td>${new Date(tx.date).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td>${tx.description}</td>
                        <td>${tx.subcategory || '—'}</td>
                        <td class="${amountClass}">${currencyPrecise.format(tx.amount)}</td>
                      </tr>
                    `;
                  })
                  .join('') || '<tr><td colspan="4">No transactions found for this category</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners to close modal
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  
  const closeModal = () => {
    modal.remove();
  };
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
  modal.addEventListener('remove', () => {
    document.body.style.overflow = '';
  });
}

function renderAirbnb(airbnb) {
  const container = document.getElementById('airbnbSummary');
  if (!container) return;
  const utilityEntries = Object.entries(airbnb.utilities || {}).map(
    ([name, value]) => `<li>${name}: <strong>${currency.format(value)}</strong></li>`,
  );
  container.innerHTML = `
    <article class="airbnb-card">
      <h3>Annual net</h3>
      <div class="value">${currency.format(airbnb.net)}</div>
      <p>Income ${currency.format(airbnb.income)} vs expenses ${currency.format(airbnb.expenses)}</p>
    </article>
    <article class="airbnb-card">
      <h3>Utilities</h3>
      <ul>${utilityEntries.join('') || '<li>No utility spend recorded</li>'}</ul>
    </article>
    <article class="airbnb-card">
      <h3>Operations</h3>
      <p>Cleaning ${currency.format(airbnb.cleaning)}</p>
      <p>Maintenance ${currency.format(airbnb.maintenance)}</p>
    </article>
    <article class="airbnb-card">
      <h3>Loan strategy</h3>
      <p>Extra repayments ${currency.format(airbnb.loan_payments)}</p>
      <p>Redraws ${currency.format(airbnb.loan_redraws)}</p>
    </article>
  `;
}

function renderRankList(list, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = list
    .map((item) => `<li><span>${item.merchant}</span><span>${currencyPrecise.format(item.total)}</span></li>`)
    .join('');
}

function renderIncomeList(list) {
  const container = document.getElementById('incomeList');
  if (!container) return;
  container.innerHTML = list
    .map((item) => `<li><span>${item.merchant}</span><span>${currencyPrecise.format(item.total)}</span></li>`)
    .join('');
}

// ==================== Budget Manager ====================

function formatVariance(variance) {
  if (variance === null || variance === undefined) {
    return '—';
  }
  const formatted = currencyPrecise.format(variance);
  const cls = variance > 0 ? 'variance-negative' : 'variance-positive';
  const descriptor = variance > 0 ? 'over' : variance < 0 ? 'under' : 'on plan';
  return `<span class="${cls}">${formatted} (${descriptor})</span>`;
}

function parseCurrencyInput(value) {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  if (!trimmed) return null;
  const normalised = trimmed.replace(/[^0-9.-]/g, '');
  if (!normalised) {
    return undefined;
  }
  const amount = Number(normalised);
  if (!Number.isFinite(amount)) {
    return undefined;
  }
  return amount;
}

function recalcBudgetItem(item) {
  const hasBudget = typeof item.annual_budget === 'number';
  const hasActual = typeof item.actual === 'number';
  const variance = hasBudget && hasActual ? item.actual - item.annual_budget : null;
  const percentOfBudget = hasBudget && hasActual && item.annual_budget !== 0 
    ? ((item.actual / item.annual_budget) * 100).toFixed(1) + '%' 
    : '—';
  return { ...item, variance, percentOfBudget };
}

function initBudgetTable(items) {
  const tbody = document.querySelector('#budgetTable tbody');
  const totalBudgetCell = document.getElementById('budgetTotalBudget');
  const totalActualCell = document.getElementById('budgetTotalActual');
  const totalVarianceCell = document.getElementById('budgetTotalVariance');
  const totalPercentCell = document.getElementById('budgetTotalPercent');
  if (!tbody || !totalBudgetCell || !totalActualCell || !totalVarianceCell) return;

  let nextId = 0;
  const savedItems = storage.getBudgetItems();
  const state = {
    items: (savedItems || items).map((item) => recalcBudgetItem({ ...item, id: String(nextId++) })),
    originalItems: items
  };

  function formatBudgetValue(value) {
    return typeof value === 'number' ? currencyPrecise.format(value) : '—';
  }

  function updateTotals() {
    function sumField(field) {
      let sum = 0;
      let hasValue = false;
      state.items.forEach((item) => {
        const value = item[field];
        if (typeof value === 'number' && Number.isFinite(value)) {
          sum += value;
          hasValue = true;
        }
      });
      return hasValue ? sum : null;
    }

    const totalBudget = sumField('annual_budget');
    const totalActual = sumField('actual');
    const totalVariance = sumField('variance');
    const totalPercent = totalBudget && totalActual && totalBudget !== 0
      ? ((totalActual / totalBudget) * 100).toFixed(1) + '%'
      : '—';

    totalBudgetCell.textContent = totalBudget !== null ? currencyPrecise.format(totalBudget) : '—';
    totalActualCell.textContent = totalActual !== null ? currencyPrecise.format(totalActual) : '—';
    totalVarianceCell.innerHTML = totalVariance !== null ? formatVariance(totalVariance) : '—';
    if (totalPercentCell) totalPercentCell.textContent = totalPercent;
  }

  function draw() {
    tbody.innerHTML = state.items
      .map((item) => {
        const budget = formatBudgetValue(item.annual_budget);
        const actual = formatBudgetValue(item.actual);
        const variance = formatVariance(item.variance);
        const percent = item.percentOfBudget || '—';
        return `
          <tr data-id="${item.id}">
            <td>${item.group}</td>
            <td>${item.item}</td>
            <td>${budget}</td>
            <td>${actual}</td>
            <td>${variance}</td>
            <td>${percent}</td>
            <td class="actions-cell">
              <div class="table-actions" role="group" aria-label="Row actions for ${item.item}">
                <button type="button" class="table-action-btn" data-action="edit" data-id="${item.id}">Edit</button>
                <button type="button" class="table-action-btn" data-action="duplicate" data-id="${item.id}">Duplicate</button>
                <button type="button" class="table-action-btn delete" data-action="delete" data-id="${item.id}">Delete</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    updateTotals();
  }

  function makeCopyLabel(baseLabel) {
    const existing = new Set(state.items.map((item) => item.item));
    if (!existing.has(`${baseLabel} (copy)`)) {
      return `${baseLabel} (copy)`;
    }
    let suffix = 2;
    let candidate = `${baseLabel} (copy ${suffix})`;
    while (existing.has(candidate)) {
      suffix += 1;
      candidate = `${baseLabel} (copy ${suffix})`;
    }
    return candidate;
  }

  function handleEdit(index) {
    const current = state.items[index];
    const budgetDefault = typeof current.annual_budget === 'number' ? current.annual_budget.toFixed(2) : '';
    const actualDefault = typeof current.actual === 'number' ? current.actual.toFixed(2) : '';

    const budgetInput = window.prompt(`Update the annual budget for ${current.item} (leave blank to clear):`, budgetDefault);
    if (budgetInput === null) return;
    const actualInput = window.prompt(`Update the actual 12-month spend for ${current.item} (leave blank to clear):`, actualDefault);
    if (actualInput === null) return;

    const nextBudget = parseCurrencyInput(budgetInput);
    const nextActual = parseCurrencyInput(actualInput);

    if (nextBudget === undefined || nextActual === undefined) {
      window.alert('Please enter valid numbers (you can leave a field blank to clear it).');
      return;
    }

    state.items[index] = recalcBudgetItem({
      ...current,
      annual_budget: nextBudget,
      actual: nextActual,
    });
    draw();
  }

  function handleDuplicate(index) {
    const source = state.items[index];
    const duplicate = recalcBudgetItem({
      ...source,
      id: String(nextId++),
      item: makeCopyLabel(source.item),
    });
    state.items.splice(index + 1, 0, duplicate);
    draw();
  }

  function handleDelete(index) {
    const { item } = state.items[index];
    const confirmed = window.confirm(`Remove ${item} from the budget summary?`);
    if (!confirmed) return;
    state.items.splice(index, 1);
    draw();
  }

  function handleAction(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;
    const { action, id } = button.dataset;
    const index = state.items.findIndex((item) => item.id === id);
    if (index === -1) return;

    if (action === 'edit') {
      handleEdit(index);
      return;
    }

    if (action === 'duplicate') {
      handleDuplicate(index);
      return;
    }

    if (action === 'delete') {
      handleDelete(index);
    }
  }

  function handleAddItem() {
    const group = window.prompt('Enter category (e.g., "Housing & Utilities"):');
    if (!group) return;
    const item = window.prompt('Enter item name:');
    if (!item) return;
    const budgetInput = window.prompt('Enter annual budget:');
    const budget = parseCurrencyInput(budgetInput);
    if (budget === undefined) {
      window.alert('Please enter a valid budget amount.');
      return;
    }

    const newItem = recalcBudgetItem({
      id: String(nextId++),
      group: group.trim(),
      item: item.trim(),
      annual_budget: budget,
      actual: null,
      notes: ''
    });

    state.items.push(newItem);
    draw();
  }

  function handleSave() {
    storage.saveBudgetItems(state.items);
    window.alert('Budget saved successfully!');
  }

  function handleReset() {
    const confirmed = window.confirm('Reset budget to original values? All changes will be lost.');
    if (!confirmed) return;
    storage.resetBudgetItems();
    nextId = 0;
    state.items = state.originalItems.map((item) => recalcBudgetItem({ ...item, id: String(nextId++) }));
    draw();
  }

  draw();
  tbody.addEventListener('click', handleAction);

  const addBtn = document.getElementById('addBudgetItem');
  if (addBtn) addBtn.addEventListener('click', handleAddItem);

  const saveBtn = document.getElementById('saveBudget');
  if (saveBtn) saveBtn.addEventListener('click', handleSave);

  const resetBtn = document.getElementById('resetBudget');
  if (resetBtn) resetBtn.addEventListener('click', handleReset);

  // Return state for chart rendering
  return state;
}

function renderBudgetProgressChart(budgetState) {
  if (!budgetState) return;
  
  const items = budgetState.items.filter(item => 
    item.annual_budget && item.actual && item.annual_budget > 0
  ).slice(0, 15);

  const labels = items.map(item => item.item);
  const budgeted = items.map(item => item.annual_budget);
  const actual = items.map(item => item.actual);

  const datasets = [
    {
      label: 'Budgeted',
      data: budgeted,
      backgroundColor: 'rgba(56, 189, 248, 0.6)',
      borderColor: 'rgba(56, 189, 248, 1)',
      borderWidth: 1
    },
    {
      label: 'Actual',
      data: actual,
      backgroundColor: 'rgba(251, 146, 60, 0.6)',
      borderColor: 'rgba(251, 146, 60, 1)',
      borderWidth: 1
    }
  ];

  createBarChart('budgetProgressChart', labels, datasets, {
    indexAxis: 'y',
    scales: {
      x: {
        ticks: { 
          color: '#94a3b8',
          callback: (value) => currency.format(value)
        },
        grid: { color: 'rgba(148, 163, 184, 0.1)' }
      },
      y: {
        ticks: { color: '#94a3b8' },
        grid: { display: false }
      }
    }
  });
}

// ==================== Monthly Statements ====================

function initMonthlyStatements(monthly, categories, transactions) {
  const selector = document.getElementById('monthSelector');
  if (!selector) return;

  // Populate month selector
  selector.innerHTML = monthly.map((m, i) => {
    const date = new Date(m.month + '-01');
    const label = date.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
    return `<option value="${i}">${label}</option>`;
  }).join('');

  function updateStatement(index) {
    const current = monthly[index];
    const previous = index > 0 ? monthly[index - 1] : null;

    // Update summary stats
    document.getElementById('statementIncome').textContent = currencyPrecise.format(current.income);
    document.getElementById('statementExpenses').textContent = currencyPrecise.format(current.expenses);
    document.getElementById('statementNet').textContent = currencyPrecise.format(current.net);
    
    const savingsRate = current.income > 0 ? ((current.net / current.income) * 100).toFixed(1) : '0.0';
    document.getElementById('statementSavingsRate').textContent = savingsRate + '%';

    // Calculate changes
    if (previous) {
      const incomeChange = current.income - previous.income;
      const expenseChange = current.expenses - previous.expenses;
      const netChange = current.net - previous.net;
      const prevSavingsRate = previous.income > 0 ? ((previous.net / previous.income) * 100) : 0;
      const savingsRateChange = parseFloat(savingsRate) - prevSavingsRate;

      document.getElementById('statementIncomeChange').textContent = 
        `${incomeChange >= 0 ? '+' : ''}${currencyPrecise.format(incomeChange)} vs last month`;
      document.getElementById('statementExpensesChange').textContent = 
        `${expenseChange >= 0 ? '+' : ''}${currencyPrecise.format(expenseChange)} vs last month`;
      document.getElementById('statementNetChange').textContent = 
        `${netChange >= 0 ? '+' : ''}${currencyPrecise.format(netChange)} vs last month`;
      document.getElementById('statementSavingsRateChange').textContent = 
        `${savingsRateChange >= 0 ? '+' : ''}${savingsRateChange.toFixed(1)}% vs last month`;
    } else {
      ['statementIncomeChange', 'statementExpensesChange', 'statementNetChange', 'statementSavingsRateChange'].forEach(id => {
        document.getElementById(id).textContent = 'No previous data';
      });
    }

    // Filter transactions for this month and calculate category breakdown
    const monthTransactions = transactions.filter(tx => tx.date.startsWith(current.month));
    const categoryBreakdown = {};
    monthTransactions.forEach(tx => {
      if (tx.type === 'expense' && tx.amount < 0) {
        categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + Math.abs(tx.amount);
      }
    });

    const categoryLabels = Object.keys(categoryBreakdown).filter(c => c !== 'Transfers');
    const categoryData = categoryLabels.map(c => categoryBreakdown[c]);

    createPieChart('statementCategoryChart', categoryLabels, categoryData);

    // Generate insights
    generateInsights(current, previous, categoryBreakdown);
  }

  function generateInsights(current, previous, categoryBreakdown) {
    const insights = [];

    // Net position insight
    if (current.net >= 0) {
      insights.push(`✅ You saved ${currencyPrecise.format(current.net)} this month!`);
    } else {
      insights.push(`⚠️ You spent ${currencyPrecise.format(Math.abs(current.net))} more than you earned this month.`);
    }

    // Month-over-month comparison
    if (previous) {
      if (current.expenses < previous.expenses) {
        const reduction = previous.expenses - current.expenses;
        insights.push(`💡 Expenses decreased by ${currencyPrecise.format(reduction)} compared to last month.`);
      } else if (current.expenses > previous.expenses * 1.1) {
        const increase = current.expenses - previous.expenses;
        insights.push(`⚠️ Expenses increased by ${currencyPrecise.format(increase)} compared to last month. Consider reviewing spending.`);
      }
    }

    // Category insights
    const sortedCategories = Object.entries(categoryBreakdown)
      .filter(([cat]) => cat !== 'Transfers')
      .sort((a, b) => b[1] - a[1]);
    
    if (sortedCategories.length > 0) {
      const [topCategory, topAmount] = sortedCategories[0];
      insights.push(`📊 Top spending category: ${topCategory} (${currencyPrecise.format(topAmount)})`);
    }

    // Savings rate insight
    const savingsRate = current.income > 0 ? ((current.net / current.income) * 100) : 0;
    if (savingsRate >= 20) {
      insights.push(`🌟 Excellent savings rate of ${savingsRate.toFixed(1)}%! Keep it up!`);
    } else if (savingsRate >= 10) {
      insights.push(`✅ Good savings rate of ${savingsRate.toFixed(1)}%. Consider increasing to 20% or more.`);
    } else if (savingsRate < 0) {
      insights.push(`⚠️ Negative savings this month. Review expenses and look for areas to cut back.`);
    }

    const insightsList = document.getElementById('insightsList');
    if (insightsList) {
      insightsList.innerHTML = insights.map(i => `<li>${i}</li>`).join('');
    }
  }

  selector.addEventListener('change', (e) => {
    updateStatement(parseInt(e.target.value));
  });

  // Download statement handler
  const downloadBtn = document.getElementById('downloadStatement');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const index = parseInt(selector.value);
      const current = monthly[index];
      const date = new Date(current.month + '-01');
      const monthName = date.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
      
      alert(`PDF download for ${monthName} would be generated here. This requires a PDF library like jsPDF.`);
    });
  }

  // Initialize with most recent month
  updateStatement(monthly.length - 1);
  selector.value = monthly.length - 1;
}

function renderCashflow(monthly) {
  const tbody = document.querySelector('#cashflowTable tbody');
  if (!tbody) return;
  tbody.innerHTML = monthly
    .map((row, index) => {
      const netClass = row.net >= 0 ? 'variance-positive' : 'variance-negative';
      const prettyMonth = new Date(`${row.month}-01`).toLocaleDateString('en-AU', {
        month: 'short',
        year: 'numeric',
      });
      const savingsRate = row.income > 0 ? ((row.net / row.income) * 100).toFixed(1) : '0.0';
      return `
        <tr>
          <td>${prettyMonth}</td>
          <td>${currencyPrecise.format(row.income)}</td>
          <td>${currencyPrecise.format(row.expenses)}</td>
          <td class="${netClass}">${currencyPrecise.format(row.net)}</td>
          <td>${savingsRate}%</td>
          <td>
            <div class="table-actions">
              <button class="table-action-btn" data-action="view-month" data-month="${index}">View Details</button>
              <button class="table-action-btn" data-action="view-transactions" data-month-string="${row.month}">View Transactions</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  // Add event listener for view details and view transactions
  tbody.addEventListener('click', (e) => {
    const viewMonthBtn = e.target.closest('[data-action="view-month"]');
    if (viewMonthBtn) {
      const monthIndex = viewMonthBtn.dataset.month;
      document.querySelector('.nav-btn[data-view="statements"]').click();
      setTimeout(() => {
        const selector = document.getElementById('monthSelector');
        if (selector) {
          selector.value = monthIndex;
          selector.dispatchEvent(new Event('change'));
        }
      }, 100);
      return;
    }

    const viewTransactionsBtn = e.target.closest('[data-action="view-transactions"]');
    if (viewTransactionsBtn) {
      const monthString = viewTransactionsBtn.dataset.monthString;
      // Navigate to transactions view
      document.querySelector('.nav-btn[data-view="transactions"]').click();
      // Apply month filter after a short delay to ensure the view is rendered
      setTimeout(() => {
        if (window.applyMonthFilterToTransactions) {
          window.applyMonthFilterToTransactions(monthString);
        }
      }, 100);
    }
  });
}

// ==================== Financial Planning ====================

function initFortnightCalculator(defaults) {
  const incomeInput = document.getElementById('fortnightIncome');
  const essentialInput = document.getElementById('fortnightEssential');
  const flexibleInput = document.getElementById('fortnightFlexible');
  const result = document.getElementById('fortnightResult');
  if (!incomeInput || !essentialInput || !flexibleInput || !result) return;

  const income = defaults.fortnightly_income ?? 0;
  const essentials = defaults.essential_fortnight ?? (defaults.fortnightly_income * 0.55);
  const flexible = defaults.discretionary_fortnight ?? (defaults.fortnightly_income * 0.2);

  incomeInput.value = income.toFixed(2);
  essentialInput.value = essentials.toFixed(2);
  flexibleInput.value = flexible.toFixed(2);

  function update() {
    const inc = Number(incomeInput.value) || 0;
    const ess = Number(essentialInput.value) || 0;
    const flex = Number(flexibleInput.value) || 0;
    const leftover = inc - ess - flex;
    const sentiment = leftover >= 0
      ? `You can direct <strong>${currencyPrecise.format(leftover)}</strong> each fortnight into savings or extra loan payments. That's <strong>${currencyPrecise.format(leftover * 26)}</strong> per year!`
      : `You are short <strong>${currencyPrecise.format(Math.abs(leftover))}</strong>. Consider trimming lifestyle spend or temporarily pausing extra repayments.`;
    result.innerHTML = sentiment;
    result.classList.toggle('variance-negative', leftover < 0);
    result.classList.toggle('variance-positive', leftover >= 0);
  }

  incomeInput.addEventListener('input', update);
  essentialInput.addEventListener('input', update);
  flexibleInput.addEventListener('input', update);
  update();
}

function initSavingsCalculator(defaults) {
  const goalInput = document.getElementById('savingsGoal');
  const currentInput = document.getElementById('savingsCurrent');
  const monthlyInput = document.getElementById('savingsMonthly');
  const interestInput = document.getElementById('savingsInterest');
  const result = document.getElementById('savingsResult');
  if (!goalInput || !currentInput || !monthlyInput || !result) return;

  goalInput.value = 20000;
  currentInput.value = 5000;
  const monthly = Math.max(defaults.monthly_surplus, 0);
  monthlyInput.value = monthly.toFixed(2);

  function update() {
    const goal = Number(goalInput.value) || 0;
    const current = Number(currentInput.value) || 0;
    const contribution = Number(monthlyInput.value) || 0;
    const annualRate = (Number(interestInput.value) || 0) / 100;
    const monthlyRate = annualRate / 12;

    if (goal <= current) {
      result.innerHTML = '🎉 Goal already achieved! Consider raising the bar or investing for growth.';
      return;
    }
    if (contribution <= 0) {
      result.innerHTML = 'Add a monthly contribution to calculate your finish line.';
      return;
    }

    // Calculate with compound interest
    let balance = current;
    let months = 0;
    while (balance < goal && months < 600) { // Cap at 50 years
      balance = balance * (1 + monthlyRate) + contribution;
      months++;
    }

    const years = Math.floor(months / 12);
    const extraMonths = months % 12;
    const finishDate = new Date();
    finishDate.setMonth(finishDate.getMonth() + months);
    const horizon = [];
    if (years) horizon.push(`${years} year${years > 1 ? 's' : ''}`);
    if (extraMonths) horizon.push(`${extraMonths} month${extraMonths > 1 ? 's' : ''}`);
    const timeText = horizon.join(' and ') || 'less than a month';

    const totalContributions = contribution * months;
    const interestEarned = balance - current - totalContributions;

    result.innerHTML = `
      Stay the course for <strong>${timeText}</strong>. You'll reach your goal by <strong>${finishDate.toLocaleDateString('en-AU', {
        month: 'short',
        year: 'numeric',
      })}</strong>.<br>
      Total contributions: ${currencyPrecise.format(totalContributions)} | Interest earned: ${currencyPrecise.format(interestEarned)}
    `;
  }

  goalInput.addEventListener('input', update);
  currentInput.addEventListener('input', update);
  monthlyInput.addEventListener('input', update);
  interestInput.addEventListener('input', update);
  update();
}

function initDebtCalculator() {
  const balanceInput = document.getElementById('debtBalance');
  const rateInput = document.getElementById('debtRate');
  const minPaymentInput = document.getElementById('debtMinPayment');
  const extraPaymentInput = document.getElementById('debtExtraPayment');
  const result = document.getElementById('debtResult');
  if (!balanceInput || !rateInput || !minPaymentInput || !result) return;

  function calculatePayoff(balance, annualRate, monthlyPayment) {
    const monthlyRate = annualRate / 12 / 100;
    let remaining = balance;
    let months = 0;
    let totalInterest = 0;

    while (remaining > 0 && months < 600) {
      const interest = remaining * monthlyRate;
      totalInterest += interest;
      const principal = Math.min(monthlyPayment - interest, remaining);
      remaining -= principal;
      months++;

      if (monthlyPayment <= interest) {
        return { months: 999, totalInterest: 999999999, totalPaid: 999999999 };
      }
    }

    return { months, totalInterest, totalPaid: balance + totalInterest };
  }

  function update() {
    const balance = Number(balanceInput.value) || 0;
    const rate = Number(rateInput.value) || 0;
    const minPayment = Number(minPaymentInput.value) || 0;
    const extraPayment = Number(extraPaymentInput.value) || 0;

    if (!balance || !rate || !minPayment) {
      result.innerHTML = 'Please fill in all fields to calculate payoff timeline.';
      return;
    }

    const withoutExtra = calculatePayoff(balance, rate, minPayment);
    const withExtra = calculatePayoff(balance, rate, minPayment + extraPayment);

    if (withoutExtra.months >= 600) {
      result.innerHTML = '⚠️ Minimum payment is too low to pay off this debt. Increase payment amount.';
      return;
    }

    const savedMonths = withoutExtra.months - withExtra.months;
    const savedInterest = withoutExtra.totalInterest - withExtra.totalInterest;

    result.innerHTML = `
      <strong>Without extra payment:</strong><br>
      Payoff in ${Math.ceil(withoutExtra.months / 12)} years (${withoutExtra.months} months)<br>
      Total interest: ${currencyPrecise.format(withoutExtra.totalInterest)}<br><br>
      <strong>With extra payment:</strong><br>
      Payoff in ${Math.ceil(withExtra.months / 12)} years (${withExtra.months} months)<br>
      Total interest: ${currencyPrecise.format(withExtra.totalInterest)}<br><br>
      💡 <strong>You'll save ${savedMonths} months and ${currencyPrecise.format(savedInterest)} in interest!</strong>
    `;
  }

  balanceInput.addEventListener('input', update);
  rateInput.addEventListener('input', update);
  minPaymentInput.addEventListener('input', update);
  extraPaymentInput.addEventListener('input', update);
  update();
}

function initAirbnbBuffer(defaults, airbnb) {
  const slider = document.getElementById('airbnbDrop');
  const valueDisplay = document.getElementById('airbnbDropValue');
  const result = document.getElementById('airbnbBuffer');
  if (!slider || !result) return;

  const annualIncome = airbnb.income || defaults.airbnb_income || 0;
  const annualExpense = airbnb.expenses || defaults.airbnb_expense || 0;

  function update() {
    const drop = Number(slider.value) || 0;
    if (valueDisplay) valueDisplay.textContent = `${drop}%`;
    
    const lostIncome = annualIncome * (drop / 100);
    const adjustedIncome = annualIncome - lostIncome;
    const newNet = adjustedIncome - annualExpense;
    const monthlyGap = newNet >= 0 ? 0 : Math.abs(newNet) / 12;
    const bufferAdvice = newNet >= 0
      ? `Even with a ${drop}% dip, you still clear ${currencyPrecise.format(newNet)} annually. Consider sweeping the surplus into your offset or investing.`
      : `A ${drop}% dip turns the property negative by ${currencyPrecise.format(Math.abs(newNet))} a year. Hold at least ${currencyPrecise.format(Math.ceil(monthlyGap) * 6)} for a 6-month emergency buffer.`;
    result.innerHTML = bufferAdvice;
  }

  slider.addEventListener('input', update);
  update();
}

function initRetirementCalculator() {
  const balanceInput = document.getElementById('retirementBalance');
  const contributionInput = document.getElementById('retirementContribution');
  const yearsInput = document.getElementById('retirementYears');
  const returnInput = document.getElementById('retirementReturn');
  const result = document.getElementById('retirementResult');
  if (!balanceInput || !contributionInput || !yearsInput || !returnInput || !result) return;

  function update() {
    const balance = Number(balanceInput.value) || 0;
    const monthlyContribution = Number(contributionInput.value) || 0;
    const years = Number(yearsInput.value) || 0;
    const annualReturn = (Number(returnInput.value) || 0) / 100;
    const monthlyReturn = annualReturn / 12;
    const months = years * 12;

    let futureValue = balance;
    let totalContributions = monthlyContribution * months;

    for (let i = 0; i < months; i++) {
      futureValue = futureValue * (1 + monthlyReturn) + monthlyContribution;
    }

    const totalGrowth = futureValue - balance - totalContributions;
    
    result.innerHTML = `
      <strong>Projected retirement balance:</strong> ${currency.format(futureValue)}<br>
      Starting balance: ${currency.format(balance)}<br>
      Total contributions: ${currency.format(totalContributions)}<br>
      Investment growth: ${currency.format(totalGrowth)}<br><br>
      💰 At a 4% withdrawal rate, that's ${currency.format(futureValue * 0.04)} per year in retirement income!
    `;
  }

  balanceInput.addEventListener('input', update);
  contributionInput.addEventListener('input', update);
  yearsInput.addEventListener('input', update);
  returnInput.addEventListener('input', update);
  update();
}

function initScenarioModeler(defaults) {
  const nameInput = document.getElementById('scenarioName');
  const costInput = document.getElementById('scenarioCostChange');
  const durationInput = document.getElementById('scenarioDuration');
  const addBtn = document.getElementById('addScenario');
  const result = document.getElementById('scenarioResult');
  const listContainer = document.getElementById('scenarioList');

  if (!addBtn || !result || !listContainer) return;

  let scenarios = storage.getScenarios();

  function renderScenarios() {
    if (scenarios.length === 0) {
      listContainer.innerHTML = '<p class="helper">No scenarios added yet. Create one above!</p>';
      return;
    }

    const baseline = defaults.monthly_surplus || 0;

    listContainer.innerHTML = `
      <h4>Saved Scenarios</h4>
      <div class="scenarios-container">
        ${scenarios.map((s, i) => {
          const newSurplus = baseline + s.costChange;
          const totalImpact = s.costChange * s.duration;
          const impactClass = newSurplus >= 0 ? 'variance-positive' : 'variance-negative';
          return `
            <div class="scenario-card">
              <div class="scenario-header">
                <strong>${s.name}</strong>
                <button class="table-action-btn delete" data-action="delete-scenario" data-index="${i}">×</button>
              </div>
              <p>Monthly impact: <span class="${impactClass}">${currencyPrecise.format(s.costChange)}</span></p>
              <p>Duration: ${s.duration} months</p>
              <p>Total impact: <span class="${impactClass}">${currencyPrecise.format(totalImpact)}</span></p>
              <p>New monthly surplus: <span class="${impactClass}">${currencyPrecise.format(newSurplus)}</span></p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  addBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    const costChange = Number(costInput.value) || 0;
    const duration = Number(durationInput.value) || 0;

    if (!name) {
      result.innerHTML = '⚠️ Please enter a scenario name.';
      return;
    }

    scenarios.push({ name, costChange, duration });
    storage.saveScenarios(scenarios);
    
    nameInput.value = '';
    costInput.value = '0';
    durationInput.value = '12';
    
    result.innerHTML = `✅ Scenario "${name}" added successfully!`;
    setTimeout(() => result.innerHTML = '', 3000);
    
    renderScenarios();
  });

  listContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="delete-scenario"]');
    if (btn) {
      const index = parseInt(btn.dataset.index);
      scenarios.splice(index, 1);
      storage.saveScenarios(scenarios);
      renderScenarios();
    }
  });

  renderScenarios();
}

// ==================== Transactions ====================

function renderTransactions(transactions) {
  const tbody = document.querySelector('#transactionTable tbody');
  const searchInput = document.getElementById('transactionSearch');
  const categorySelect = document.getElementById('transactionCategory');
  const typeSelect = document.getElementById('transactionType');
  const dateFromInput = document.getElementById('transactionDateFrom');
  const dateToInput = document.getElementById('transactionDateTo');
  const clearBtn = document.getElementById('clearFilters');
  const countDisplay = document.getElementById('transactionCount');
  const totalDisplay = document.getElementById('transactionTotal');
  const prevBtn = document.getElementById('prevPage');
  const nextBtn = document.getElementById('nextPage');
  const pageInfo = document.getElementById('pageInfo');

  if (!tbody || !categorySelect) return;

  const ITEMS_PER_PAGE = 50;
  let nextId = 0;
  const state = {
    transactions: transactions.map((tx) => ({ ...tx, id: String(nextId++) })),
    filters: {
      search: '',
      category: 'all',
      type: 'all',
      dateFrom: '',
      dateTo: ''
    },
    currentPage: 1
  };

  // Expose function to apply month filter from external code
  window.applyMonthFilterToTransactions = (monthString) => {
    // monthString format: YYYY-MM
    const year = monthString.substring(0, 4);
    const month = monthString.substring(5, 7);
    const firstDay = `${year}-${month}-01`;
    const lastDay = new Date(parseInt(year), parseInt(month), 0).toISOString().split('T')[0];
    
    state.filters.dateFrom = firstDay;
    state.filters.dateTo = lastDay;
    dateFromInput.value = firstDay;
    dateToInput.value = lastDay;
    state.currentPage = 1;
    draw();
  };

  function getFilteredTransactions() {
    return state.transactions.filter(tx => {
      if (state.filters.search) {
        const search = state.filters.search.toLowerCase();
        if (!tx.description.toLowerCase().includes(search)) return false;
      }
      if (state.filters.category !== 'all' && tx.category !== state.filters.category) return false;
      if (state.filters.type !== 'all' && tx.type !== state.filters.type) return false;
      if (state.filters.dateFrom && tx.date < state.filters.dateFrom) return false;
      if (state.filters.dateTo && tx.date > state.filters.dateTo) return false;
      return true;
    });
  }

  function refreshFilterOptions() {
    const categories = Array.from(new Set(state.transactions.map((tx) => tx.category))).sort();
    const previousCategory = state.filters.category;
    const optionMarkup = ['<option value="all">All categories</option>']
      .concat(categories.map((cat) => `<option value="${cat}">${cat}</option>`))
      .join('');
    categorySelect.innerHTML = optionMarkup;
    if (previousCategory !== 'all' && !categories.includes(previousCategory)) {
      state.filters.category = 'all';
    }
    categorySelect.value = state.filters.category;
  }

  function draw() {
    const filtered = getFilteredTransactions();
    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const pageTransactions = filtered.slice(startIndex, endIndex);

    const rows = pageTransactions
      .map((tx) => {
        const amountClass = tx.amount < 0 ? 'variance-negative' : 'variance-positive';
        return `
          <tr data-id="${tx.id}">
            <td>${new Date(tx.date).toLocaleDateString('en-AU')}</td>
            <td>${tx.description}</td>
            <td>${tx.category}</td>
            <td>${tx.subcategory}</td>
            <td class="${amountClass}">${currencyPrecise.format(tx.amount)}</td>
            <td>
              <div class="table-actions">
                <button type="button" class="table-action-btn" data-action="edit" data-id="${tx.id}">Edit</button>
                <button type="button" class="table-action-btn delete" data-action="delete" data-id="${tx.id}">Delete</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');

    tbody.innerHTML = rows || '<tr><td colspan="6">No transactions match your filters.</td></tr>';

    // Update stats
    const total = filtered.reduce((sum, tx) => sum + tx.amount, 0);
    countDisplay.textContent = `${filtered.length} transactions`;
    totalDisplay.textContent = currencyPrecise.format(total);

    // Update pagination
    pageInfo.textContent = `Page ${state.currentPage} of ${totalPages || 1}`;
    prevBtn.disabled = state.currentPage === 1;
    nextBtn.disabled = state.currentPage >= totalPages;
  }

  function handleAction(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const { action, id } = button.dataset;
    const index = state.transactions.findIndex((tx) => tx.id === id);
    if (index === -1) return;

    if (action === 'delete') {
      const confirmed = window.confirm('Remove this transaction from the explorer?');
      if (!confirmed) return;
      state.transactions.splice(index, 1);
      refreshFilterOptions();
      draw();
      return;
    }

    if (action === 'edit') {
      const currentAmount = state.transactions[index].amount;
      const input = window.prompt('Enter the new amount (use negative numbers for expenses):', currentAmount);
      if (input === null) return;
      const normalised = input.replace(/,/g, '').trim();
      const nextAmount = Number(normalised);
      if (!Number.isFinite(nextAmount)) {
        window.alert('Please enter a valid number.');
        return;
      }
      state.transactions[index] = { ...state.transactions[index], amount: nextAmount };
      draw();
    }
  }

  // Event listeners
  searchInput.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    state.currentPage = 1;
    draw();
  });

  categorySelect.addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    state.currentPage = 1;
    draw();
  });

  typeSelect.addEventListener('change', (e) => {
    state.filters.type = e.target.value;
    state.currentPage = 1;
    draw();
  });

  dateFromInput.addEventListener('change', (e) => {
    state.filters.dateFrom = e.target.value;
    state.currentPage = 1;
    draw();
  });

  dateToInput.addEventListener('change', (e) => {
    state.filters.dateTo = e.target.value;
    state.currentPage = 1;
    draw();
  });

  clearBtn.addEventListener('click', () => {
    state.filters = { search: '', category: 'all', type: 'all', dateFrom: '', dateTo: '' };
    searchInput.value = '';
    categorySelect.value = 'all';
    typeSelect.value = 'all';
    dateFromInput.value = '';
    dateToInput.value = '';
    state.currentPage = 1;
    draw();
  });

  prevBtn.addEventListener('click', () => {
    if (state.currentPage > 1) {
      state.currentPage--;
      draw();
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalPages = Math.ceil(getFilteredTransactions().length / ITEMS_PER_PAGE);
    if (state.currentPage < totalPages) {
      state.currentPage++;
      draw();
    }
  });

  tbody.addEventListener('click', handleAction);

  refreshFilterOptions();
  draw();
}

// ==================== Category Manager ====================

function initCategoryManager(transactions) {
  const categoryFilter = document.getElementById('categoryFilter');
  const typeFilter = document.getElementById('categoryTypeFilter');
  const periodFilter = document.getElementById('categoryPeriodFilter');
  const summaryGrid = document.getElementById('categorySummaryGrid');
  const breakdownTable = document.querySelector('#categoryBreakdownTable tbody');
  const detailPanel = document.getElementById('categoryDetailPanel');
  const detailTitle = document.getElementById('categoryDetailTitle');
  const detailContent = document.getElementById('categoryDetailContent');
  const closeDetailBtn = document.getElementById('closeCategoryDetail');
  const categoryTxTable = document.querySelector('#categoryTransactionsTable tbody');
  const selectAllCheckbox = document.getElementById('selectAllCategoryTx');
  const bulkMoveCategory = document.getElementById('bulkMoveCategory');
  const bulkMoveSubcategory = document.getElementById('bulkMoveSubcategory');
  const applyBulkMoveBtn = document.getElementById('applyBulkMove');
  const uploadBtn = document.getElementById('uploadStatement');
  const uploadFile = document.getElementById('uploadStatementFile');
  const exportBtn = document.getElementById('exportCategories');

  if (!categoryFilter || !summaryGrid || !breakdownTable) return;

  let nextTxId = 0;
  const state = {
    transactions: transactions.map((tx) => ({ ...tx, id: String(nextTxId++) })),
    filters: {
      category: 'all',
      type: 'all',
      period: 'all'
    },
    selectedCategory: null,
    selectedSubcategory: null,
    categoryChanges: loadCategoryChanges()
  };

  function loadCategoryChanges() {
    const saved = localStorage.getItem('cowell_budget_category_changes');
    return saved ? JSON.parse(saved) : {};
  }

  function saveCategoryChanges() {
    localStorage.setItem('cowell_budget_category_changes', JSON.stringify(state.categoryChanges));
  }

  function applyCustomCategories() {
    state.transactions.forEach(tx => {
      const key = `${tx.date}-${tx.description}-${tx.amount}`;
      if (state.categoryChanges[key]) {
        const change = state.categoryChanges[key];
        tx.category = change.category;
        tx.subcategory = change.subcategory;
      }
    });
  }

  function filterByPeriod(tx) {
    if (state.filters.period === 'all') return true;
    const txDate = new Date(tx.date);
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    switch (state.filters.period) {
      case 'month':
        return txDate >= monthStart;
      case 'quarter':
        return txDate >= quarterStart;
      case 'year':
        return txDate >= yearStart;
      default:
        return true;
    }
  }

  function getFilteredTransactions() {
    return state.transactions.filter(tx => {
      if (state.filters.category !== 'all' && tx.category !== state.filters.category) return false;
      if (state.filters.type !== 'all' && tx.type !== state.filters.type) return false;
      if (!filterByPeriod(tx)) return false;
      return true;
    });
  }

  function aggregateByCategory(transactions) {
    const categoryMap = new Map();
    transactions.forEach(tx => {
      const key = `${tx.category}|||${tx.subcategory}`;
      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          category: tx.category,
          subcategory: tx.subcategory,
          income: 0,
          expense: 0,
          count: 0
        });
      }
      const entry = categoryMap.get(key);
      entry.count++;
      if (tx.type === 'income' && tx.amount > 0) {
        entry.income += tx.amount;
      } else if (tx.type === 'expense' && tx.amount < 0) {
        entry.expense += Math.abs(tx.amount);
      }
    });
    return Array.from(categoryMap.values());
  }

  function renderSummaryCards(aggregated) {
    const totalExpenses = aggregated.reduce((sum, item) => sum + item.expense, 0);
    const totalIncome = aggregated.reduce((sum, item) => sum + item.income, 0);

    const categoryTotals = new Map();
    aggregated.forEach(item => {
      if (!categoryTotals.has(item.category)) {
        categoryTotals.set(item.category, { income: 0, expense: 0, count: 0 });
      }
      const total = categoryTotals.get(item.category);
      total.income += item.income;
      total.expense += item.expense;
      total.count += item.count;
    });

    const sortedCategories = Array.from(categoryTotals.entries())
      .sort((a, b) => b[1].expense - a[1].expense)
      .slice(0, 8);

    summaryGrid.innerHTML = sortedCategories.map(([category, data]) => {
      const net = data.income - data.expense;
      const percentage = totalExpenses > 0 ? (data.expense / totalExpenses * 100).toFixed(1) : 0;
      return `
        <div class="category-summary-card" data-category="${category}">
          <h4>${category}</h4>
          <div class="amount">${currency.format(data.expense)}</div>
          <div class="meta">
            ${data.count} transactions • ${percentage}% of spending
          </div>
        </div>
      `;
    }).join('');

    // Add click handlers to cards
    summaryGrid.querySelectorAll('.category-summary-card').forEach(card => {
      card.addEventListener('click', () => {
        const category = card.dataset.category;
        showCategoryDetail(category);
      });
    });
  }

  function renderBreakdownTable(aggregated) {
    const totalExpenses = aggregated.reduce((sum, item) => sum + item.expense, 0);
    const totalIncome = aggregated.reduce((sum, item) => sum + item.income, 0);

    breakdownTable.innerHTML = aggregated
      .sort((a, b) => b.expense - a.expense)
      .map(item => {
        const net = item.income - item.expense;
        const percentage = totalExpenses > 0 ? (item.expense / totalExpenses * 100).toFixed(1) : 0;
        const netClass = net >= 0 ? 'variance-positive' : 'variance-negative';
        return `
          <tr>
            <td>${item.category}</td>
            <td>${item.subcategory}</td>
            <td>${currencyPrecise.format(item.income)}</td>
            <td>${currencyPrecise.format(item.expense)}</td>
            <td class="${netClass}">${currencyPrecise.format(net)}</td>
            <td>${percentage}%</td>
            <td>${item.count}</td>
            <td>
              <button class="table-action-btn" data-action="view-category" 
                      data-category="${item.category}" data-subcategory="${item.subcategory}">
                View
              </button>
            </td>
          </tr>
        `;
      }).join('');

    breakdownTable.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action="view-category"]');
      if (btn) {
        showCategoryDetail(btn.dataset.category, btn.dataset.subcategory);
      }
    });
  }

  function showCategoryDetail(category, subcategory = null) {
    state.selectedCategory = category;
    state.selectedSubcategory = subcategory;

    const filtered = state.transactions.filter(tx => {
      if (tx.category !== category) return false;
      if (subcategory && tx.subcategory !== subcategory) return false;
      return true;
    });

    const income = filtered.filter(tx => tx.type === 'income' && tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    const expense = filtered.filter(tx => tx.type === 'expense' && tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const net = income - expense;

    detailTitle.textContent = subcategory 
      ? `${category} - ${subcategory}` 
      : category;

    detailContent.innerHTML = `
      <div class="category-stat-row">
        <div class="category-stat-item">
          <label>Total Income</label>
          <div class="value">${currency.format(income)}</div>
        </div>
        <div class="category-stat-item">
          <label>Total Expenses</label>
          <div class="value">${currency.format(expense)}</div>
        </div>
        <div class="category-stat-item">
          <label>Net</label>
          <div class="value ${net >= 0 ? 'variance-positive' : 'variance-negative'}">
            ${currency.format(net)}
          </div>
        </div>
        <div class="category-stat-item">
          <label>Transactions</label>
          <div class="value">${filtered.length}</div>
        </div>
      </div>
    `;

    categoryTxTable.innerHTML = filtered
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(tx => {
        const amountClass = tx.amount < 0 ? 'variance-negative' : 'variance-positive';
        return `
          <tr data-tx-id="${tx.id}">
            <td><input type="checkbox" class="category-tx-checkbox" data-tx-id="${tx.id}"></td>
            <td>${new Date(tx.date).toLocaleDateString('en-AU')}</td>
            <td>${tx.description}</td>
            <td class="${amountClass}">${currencyPrecise.format(tx.amount)}</td>
            <td>
              <button class="table-action-btn" data-action="move-single" data-tx-id="${tx.id}">
                Move
              </button>
            </td>
          </tr>
        `;
      }).join('');

    populateCategorySelectors();
    detailPanel.style.display = 'block';
    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function populateCategorySelectors() {
    const categories = [...new Set(state.transactions.map(tx => tx.category))].sort();
    
    bulkMoveCategory.innerHTML = '<option value="">Select category...</option>' +
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');

    bulkMoveCategory.addEventListener('change', () => {
      const selectedCat = bulkMoveCategory.value;
      if (!selectedCat) {
        bulkMoveSubcategory.innerHTML = '<option value="">Select category first</option>';
        return;
      }
      const subcategories = [...new Set(
        state.transactions
          .filter(tx => tx.category === selectedCat)
          .map(tx => tx.subcategory)
      )].sort();
      bulkMoveSubcategory.innerHTML = '<option value="">Select subcategory...</option>' +
        subcategories.map(sub => `<option value="${sub}">${sub}</option>`).join('');
    });
  }

  function moveSingleTransaction(txId) {
    const category = prompt('Enter new category:');
    if (!category) return;
    const subcategory = prompt('Enter new subcategory:');
    if (!subcategory) return;

    const tx = state.transactions.find(t => t.id === txId);
    if (tx) {
      const key = `${tx.date}-${tx.description}-${tx.amount}`;
      state.categoryChanges[key] = { category, subcategory };
      tx.category = category;
      tx.subcategory = subcategory;
      saveCategoryChanges();
      refresh();
      alert('Transaction category updated!');
    }
  }

  function moveSelectedTransactions() {
    const selectedCheckboxes = document.querySelectorAll('.category-tx-checkbox:checked');
    const category = bulkMoveCategory.value;
    const subcategory = bulkMoveSubcategory.value;

    if (!category || !subcategory) {
      alert('Please select both category and subcategory');
      return;
    }

    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.txId);
    let count = 0;

    selectedIds.forEach(id => {
      const tx = state.transactions.find(t => t.id === id);
      if (tx) {
        const key = `${tx.date}-${tx.description}-${tx.amount}`;
        state.categoryChanges[key] = { category, subcategory };
        tx.category = category;
        tx.subcategory = subcategory;
        count++;
      }
    });

    if (count > 0) {
      saveCategoryChanges();
      refresh();
      alert(`Moved ${count} transaction(s) to ${category} - ${subcategory}`);
    }
  }

  function handleCSVUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvText = e.target.result;
        const lines = csvText.split('\n');
        const newTransactions = [];
        
        // Parse CSV (skip header)
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          // Simple CSV parsing (handles basic cases)
          const parts = line.split(',');
          if (parts.length < 5) continue;
          
          const date = parts[0].trim();
          const description = parts[2].replace(/^"|"$/g, '').trim();
          const amount = parseFloat(parts[4]) || 0;
          const balance = parseFloat(parts[5]) || null;
          
          if (amount === 0) continue;
          
          // Auto-categorize using existing logic
          const tx = {
            id: String(nextTxId++),
            date: formatDateFromCSV(date),
            description: description,
            amount: amount,
            balance: balance,
            account: file.name,
            category: 'Uncategorized',
            subcategory: 'Other',
            type: amount > 0 ? 'income' : 'expense'
          };
          
          // Apply smart categorization
          categorizeTransaction(tx);
          newTransactions.push(tx);
        }
        
        state.transactions.push(...newTransactions);
        saveCategoryChanges();
        refresh();
        alert(`Successfully imported ${newTransactions.length} transactions!`);
      } catch (error) {
        alert('Error parsing CSV file: ' + error.message);
      }
    };
    reader.readAsText(file);
  }

  function formatDateFromCSV(dateStr) {
    // Handle "DD MMM YYYY" format
    try {
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }

  function categorizeTransaction(tx) {
    const desc = tx.description.toUpperCase();
    
    // Simple keyword-based categorization
    if (desc.includes('WOOLWORTHS') || desc.includes('COLES') || desc.includes('FOODWORKS')) {
      tx.category = 'Groceries & Dining';
      tx.subcategory = 'Groceries';
    } else if (desc.includes('BP ') || desc.includes('MOBIL') || desc.includes('CALTEX')) {
      tx.category = 'Transportation';
      tx.subcategory = 'Fuel';
    } else if (desc.includes('TELSTRA') || desc.includes('INTERNET')) {
      tx.category = 'Housing & Utilities';
      tx.subcategory = 'Telecom - Home';
    } else if (desc.includes('ORIGIN ENERGY')) {
      tx.category = 'Housing & Utilities';
      tx.subcategory = 'Electricity - Home';
    } else if (desc.includes('SALARY') || desc.includes('PAYRO')) {
      tx.category = 'Income';
      tx.subcategory = 'Salary';
      tx.type = 'income';
    }
  }

  function refresh() {
    applyCustomCategories();
    const filtered = getFilteredTransactions();
    const aggregated = aggregateByCategory(filtered);
    renderSummaryCards(aggregated);
    renderBreakdownTable(aggregated);
    
    if (state.selectedCategory) {
      showCategoryDetail(state.selectedCategory, state.selectedSubcategory);
    }
  }

  function populateCategoryFilter() {
    const categories = [...new Set(state.transactions.map(tx => tx.category))].sort();
    categoryFilter.innerHTML = '<option value="all">All Categories</option>' +
      categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  }

  // Event Listeners
  categoryFilter.addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    refresh();
  });

  typeFilter.addEventListener('change', (e) => {
    state.filters.type = e.target.value;
    refresh();
  });

  periodFilter.addEventListener('change', (e) => {
    state.filters.period = e.target.value;
    refresh();
  });

  closeDetailBtn.addEventListener('click', () => {
    detailPanel.style.display = 'none';
    state.selectedCategory = null;
    state.selectedSubcategory = null;
  });

  selectAllCheckbox.addEventListener('change', (e) => {
    document.querySelectorAll('.category-tx-checkbox').forEach(cb => {
      cb.checked = e.target.checked;
    });
  });

  applyBulkMoveBtn.addEventListener('click', moveSelectedTransactions);

  categoryTxTable.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="move-single"]');
    if (btn) {
      moveSingleTransaction(btn.dataset.txId);
    }
  });

  uploadBtn.addEventListener('click', () => {
    uploadFile.click();
  });

  uploadFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      handleCSVUpload(file);
      e.target.value = ''; // Reset file input
    }
  });

  exportBtn.addEventListener('click', () => {
    const filtered = getFilteredTransactions();
    const aggregated = aggregateByCategory(filtered);
    const exportData = {
      summary: aggregated,
      transactions: filtered,
      categoryChanges: state.categoryChanges,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `category-breakdown-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Initialize
  populateCategoryFilter();
  applyCustomCategories();
  refresh();
}

// ==================== Export/Import ====================

function initDataManagement(data) {
  const exportBtn = document.getElementById('exportData');
  const importBtn = document.getElementById('importData');
  const importFile = document.getElementById('importFile');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const exportData = {
        budget: storage.getBudgetItems(),
        scenarios: storage.getScenarios(),
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cowell-budget-export-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => {
      importFile.click();
    });

    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          
          if (imported.budget) {
            storage.saveBudgetItems(imported.budget);
          }
          if (imported.scenarios) {
            storage.saveScenarios(imported.scenarios);
          }
          
          alert('Data imported successfully! Refreshing page...');
          window.location.reload();
        } catch (error) {
          alert('Error importing data: ' + error.message);
        }
      };
      reader.readAsText(file);
    });
  }
}

// ==================== AI Financial Assistant ====================

class AIFinancialAssistant {
  constructor(transactions, monthlyCashflow) {
    this.transactions = transactions;
    this.monthlyCashflow = monthlyCashflow;
    this.subscriptions = [];
    this.anomalies = [];
    this.savingsOpportunities = [];
    this.subcategoryRules = this.loadSubcategoryRules();
  }

  loadSubcategoryRules() {
    const saved = localStorage.getItem('cowell_budget_subcategory_rules');
    return saved ? JSON.parse(saved) : this.getDefaultRules();
  }

  saveSubcategoryRules() {
    localStorage.setItem('cowell_budget_subcategory_rules', JSON.stringify(this.subcategoryRules));
  }

  getDefaultRules() {
    return [
      { keyword: 'NETFLIX', category: 'Lifestyle & Shopping', subcategory: 'Netflix', matchCount: 0 },
      { keyword: 'SPOTIFY', category: 'Lifestyle & Shopping', subcategory: 'Spotify', matchCount: 0 },
      { keyword: 'DISNEY', category: 'Lifestyle & Shopping', subcategory: 'Disney+', matchCount: 0 },
      { keyword: 'AMAZON PRIME', category: 'Lifestyle & Shopping', subcategory: 'Amazon Prime', matchCount: 0 },
      { keyword: 'APPLE.COM/BILL', category: 'Lifestyle & Shopping', subcategory: 'Apple Services', matchCount: 0 },
      { keyword: 'YOUTUBE PREMIUM', category: 'Lifestyle & Shopping', subcategory: 'YouTube Premium', matchCount: 0 },
      { keyword: 'CLAUDE.AI', category: 'Professional', subcategory: 'AI Tools', matchCount: 0 },
      { keyword: 'CHATGPT', category: 'Professional', subcategory: 'AI Tools', matchCount: 0 },
      { keyword: 'ADOBE', category: 'Professional', subcategory: 'Software Subscriptions', matchCount: 0 }
    ];
  }

  applySubcategoryRules(transaction) {
    const desc = transaction.description.toUpperCase();
    for (const rule of this.subcategoryRules) {
      if (desc.includes(rule.keyword.toUpperCase())) {
        rule.matchCount = (rule.matchCount || 0) + 1;
        return {
          category: rule.category,
          subcategory: rule.subcategory,
          matched: true
        };
      }
    }
    return { matched: false };
  }

  // Detect recurring payments and subscriptions
  detectRecurringPayments() {
    const merchantGroups = new Map();
    
    // Group transactions by merchant
    this.transactions.forEach(tx => {
      if (tx.amount >= 0) return; // Only expenses
      
      const merchant = this.normalizeMerchant(tx.description);
      if (!merchantGroups.has(merchant)) {
        merchantGroups.set(merchant, []);
      }
      merchantGroups.get(merchant).push(tx);
    });

    this.subscriptions = [];

    merchantGroups.forEach((txs, merchant) => {
      if (txs.length < 2) return; // Need at least 2 transactions

      // Sort by date
      txs.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Calculate intervals between transactions
      const intervals = [];
      for (let i = 1; i < txs.length; i++) {
        const daysDiff = Math.round((new Date(txs[i].date) - new Date(txs[i-1].date)) / (1000 * 60 * 60 * 24));
        intervals.push(daysDiff);
      }

      // Check if intervals are consistent (within 20% variance)
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const maxDeviation = avgInterval * 0.2;
      const isRecurring = intervals.every(interval => Math.abs(interval - avgInterval) <= maxDeviation);

      if (isRecurring && avgInterval >= 7) { // At least weekly
        // Detect frequency
        let frequency = 'Unknown';
        let annualMultiplier = 12;
        
        if (avgInterval >= 28 && avgInterval <= 33) {
          frequency = 'Monthly';
          annualMultiplier = 12;
        } else if (avgInterval >= 85 && avgInterval <= 95) {
          frequency = 'Quarterly';
          annualMultiplier = 4;
        } else if (avgInterval >= 360 && avgInterval <= 370) {
          frequency = 'Annually';
          annualMultiplier = 1;
        } else if (avgInterval >= 12 && avgInterval <= 16) {
          frequency = 'Bi-weekly';
          annualMultiplier = 26;
        } else if (avgInterval >= 6 && avgInterval <= 8) {
          frequency = 'Weekly';
          annualMultiplier = 52;
        }

        // Calculate average amount
        const amounts = txs.map(tx => Math.abs(tx.amount));
        const avgAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
        const amountVariance = Math.max(...amounts) - Math.min(...amounts);
        
        // Determine status
        let status = 'Active';
        const daysSinceLastTransaction = Math.round((new Date() - new Date(txs[txs.length - 1].date)) / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastTransaction > avgInterval * 2) {
          status = 'Inactive';
        } else if (daysSinceLastTransaction > avgInterval * 1.5) {
          status = 'Warning';
        }

        // Apply subcategory rules
        const ruleMatch = this.applySubcategoryRules(txs[0]);
        
        this.subscriptions.push({
          merchant,
          category: ruleMatch.matched ? ruleMatch.category : txs[0].category,
          subcategory: ruleMatch.matched ? ruleMatch.subcategory : txs[0].subcategory,
          frequency,
          avgAmount,
          annualCost: avgAmount * annualMultiplier,
          lastSeen: txs[txs.length - 1].date,
          count: txs.length,
          status,
          amountVariance,
          transactions: txs,
          avgInterval
        });
      }
    });

    // Sort by annual cost descending
    this.subscriptions.sort((a, b) => b.annualCost - a.annualCost);
    return this.subscriptions;
  }

  normalizeMerchant(description) {
    // Remove common suffixes and normalize merchant names
    let normalized = description
      .replace(/\s+(PTY\s+LTD|LIMITED|LTD|INC|CORP|CO|AUSTRALIA).*$/i, '')
      .replace(/\s+\d+.*$/, '') // Remove numbers at end
      .trim();
    
    // Special cases for known merchants
    if (normalized.toUpperCase().includes('NETFLIX')) return 'Netflix';
    if (normalized.toUpperCase().includes('SPOTIFY')) return 'Spotify';
    if (normalized.toUpperCase().includes('DISNEY')) return 'Disney+';
    if (normalized.toUpperCase().includes('CLAUDE')) return 'Claude AI';
    if (normalized.toUpperCase().includes('CHATGPT')) return 'ChatGPT';
    if (normalized.toUpperCase().includes('AMAZON')) return 'Amazon';
    if (normalized.toUpperCase().includes('APPLE.COM')) return 'Apple';
    
    return normalized;
  }

  // Detect spending anomalies
  detectAnomalies() {
    this.anomalies = [];
    
    // Group by category and calculate statistics
    const categoryStats = new Map();
    
    this.transactions.forEach(tx => {
      if (tx.amount >= 0) return; // Only expenses
      
      const key = `${tx.category}-${tx.subcategory}`;
      if (!categoryStats.has(key)) {
        categoryStats.set(key, {
          category: tx.category,
          subcategory: tx.subcategory,
          amounts: [],
          transactions: []
        });
      }
      
      const stats = categoryStats.get(key);
      stats.amounts.push(Math.abs(tx.amount));
      stats.transactions.push(tx);
    });

    // Calculate mean and standard deviation for each category
    categoryStats.forEach((stats, key) => {
      if (stats.amounts.length < 3) return; // Need enough data
      
      const mean = stats.amounts.reduce((a, b) => a + b, 0) / stats.amounts.length;
      const variance = stats.amounts.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / stats.amounts.length;
      const stdDev = Math.sqrt(variance);
      
      // Find outliers (more than 2 standard deviations from mean)
      stats.transactions.forEach(tx => {
        const amount = Math.abs(tx.amount);
        const zScore = (amount - mean) / stdDev;
        
        if (Math.abs(zScore) > 2 && amount > mean * 1.5) {
          let priority = 'Medium';
          let reason = `Unusual amount for ${stats.category}`;
          
          if (Math.abs(zScore) > 3) {
            priority = 'High';
            reason = `Significantly higher than typical ${stats.category} spending`;
          }
          
          // Additional anomaly checks
          const isDuplicate = this.checkDuplicateTransaction(tx, stats.transactions);
          if (isDuplicate) {
            priority = 'High';
            reason = 'Possible duplicate transaction';
          }
          
          this.anomalies.push({
            transaction: tx,
            priority,
            reason,
            expectedRange: `${currency.format(mean - stdDev)} - ${currency.format(mean + stdDev)}`,
            deviation: `${(zScore * 100).toFixed(0)}%`,
            zScore
          });
        }
      });
    });

    // Detect unusual timing patterns
    this.detectTimingAnomalies();
    
    // Sort by priority and amount
    this.anomalies.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return Math.abs(b.transaction.amount) - Math.abs(a.transaction.amount);
    });

    return this.anomalies;
  }

  checkDuplicateTransaction(tx, allTxs) {
    // Check for same amount within 3 days
    const txDate = new Date(tx.date);
    return allTxs.some(other => {
      if (other === tx) return false;
      const otherDate = new Date(other.date);
      const daysDiff = Math.abs((txDate - otherDate) / (1000 * 60 * 60 * 24));
      return daysDiff <= 3 && Math.abs(other.amount - tx.amount) < 0.01;
    });
  }

  detectTimingAnomalies() {
    // Detect multiple large transactions on same day
    const dateGroups = new Map();
    
    this.transactions.forEach(tx => {
      if (tx.amount >= 0 || Math.abs(tx.amount) < 100) return;
      
      if (!dateGroups.has(tx.date)) {
        dateGroups.set(tx.date, []);
      }
      dateGroups.get(tx.date).push(tx);
    });

    dateGroups.forEach((txs, date) => {
      if (txs.length >= 3) {
        const totalSpent = txs.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
        this.anomalies.push({
          transaction: txs[0], // Representative transaction
          priority: 'Medium',
          reason: `${txs.length} large transactions on same day (total: ${currency.format(totalSpent)})`,
          relatedTransactions: txs
        });
      }
    });
  }

  // Generate savings opportunities
  generateSavingsOpportunities() {
    this.savingsOpportunities = [];
    
    // Analyze subscriptions
    this.analyzeSubscriptionSavings();
    
    // Analyze category spending
    this.analyzeCategorySpending();
    
    // Detect inactive subscriptions
    this.detectInactiveSubscriptions();
    
    // Compare to benchmarks
    this.compareToSpendingBenchmarks();
    
    // Sort by potential savings
    this.savingsOpportunities.sort((a, b) => b.potentialSavings - a.potentialSavings);
    
    return this.savingsOpportunities;
  }

  analyzeSubscriptionSavings() {
    const totalSubscriptions = this.subscriptions
      .filter(s => s.status === 'Active')
      .reduce((sum, s) => sum + s.annualCost, 0);
    
    if (totalSubscriptions > 3000) { // $250/month threshold
      this.savingsOpportunities.push({
        category: 'Subscriptions',
        title: 'Review Subscription Services',
        description: `You have ${this.subscriptions.length} recurring payments totaling ${currency.format(totalSubscriptions)} annually. Consider auditing which services you actively use.`,
        potentialSavings: totalSubscriptions * 0.3, // Assume 30% could be saved
        priority: 'High',
        actionItems: [
          'Cancel unused streaming services',
          'Check for duplicate subscriptions',
          'Look for annual payment discounts',
          'Share family plans where possible'
        ],
        relatedData: this.subscriptions.filter(s => s.status === 'Active')
      });
    }
  }

  analyzeCategorySpending() {
    // Analyze groceries and dining
    const groceryTxs = this.transactions.filter(tx => 
      tx.category === 'Groceries & Dining' && tx.amount < 0
    );
    
    if (groceryTxs.length > 0) {
      const monthlyGroceries = Math.abs(groceryTxs.reduce((sum, tx) => sum + tx.amount, 0)) / 12;
      
      if (monthlyGroceries > 1200) { // Above average
        this.savingsOpportunities.push({
          category: 'Groceries & Dining',
          title: 'Optimize Grocery Spending',
          description: `Spending ${currency.format(monthlyGroceries)} per month on groceries and dining. This is above the Australian household average.`,
          potentialSavings: (monthlyGroceries - 1000) * 12,
          priority: 'Medium',
          actionItems: [
            'Create weekly meal plans to reduce impulse purchases',
            'Compare prices between major supermarkets',
            'Reduce dining out/takeaway frequency',
            'Buy generic brands for staple items',
            'Use grocery rewards programs'
          ]
        });
      }
    }

    // Analyze utilities
    const utilitiesTxs = this.transactions.filter(tx => 
      (tx.category === 'Housing & Utilities' || tx.subcategory?.includes('Utilities')) && tx.amount < 0
    );
    
    if (utilitiesTxs.length > 0) {
      const monthlyUtilities = Math.abs(utilitiesTxs.reduce((sum, tx) => sum + tx.amount, 0)) / 12;
      
      if (monthlyUtilities > 400) {
        this.savingsOpportunities.push({
          category: 'Housing & Utilities',
          title: 'Review Utility Providers',
          description: `Utility costs average ${currency.format(monthlyUtilities)} per month. Consider switching providers or plans.`,
          potentialSavings: monthlyUtilities * 0.2 * 12, // 20% potential savings
          priority: 'Medium',
          actionItems: [
            'Compare electricity and gas providers',
            'Review internet and phone plans',
            'Consider solar panels for long-term savings',
            'Install energy-efficient appliances',
            'Check eligibility for government rebates'
          ]
        });
      }
    }
  }

  detectInactiveSubscriptions() {
    const inactive = this.subscriptions.filter(s => s.status === 'Inactive' || s.status === 'Warning');
    
    if (inactive.length > 0) {
      const potentialSavings = inactive.reduce((sum, s) => sum + s.annualCost, 0);
      
      this.savingsOpportunities.push({
        category: 'Subscriptions',
        title: 'Cancel Inactive Subscriptions',
        description: `Found ${inactive.length} subscriptions that haven't been charged recently. These may have been forgotten.`,
        potentialSavings,
        priority: 'High',
        actionItems: inactive.map(s => `Review ${s.merchant} - last seen ${new Date(s.lastSeen).toLocaleDateString()}`),
        relatedData: inactive
      });
    }
  }

  compareToSpendingBenchmarks() {
    // Australian household spending benchmarks
    const totalMonthlyExpenses = Math.abs(
      this.transactions
        .filter(tx => tx.amount < 0)
        .reduce((sum, tx) => sum + tx.amount, 0)
    ) / 12;

    const benchmarks = {
      'Transportation': { threshold: 600, percentage: 0.15 },
      'Entertainment & Recreation': { threshold: 300, percentage: 0.08 }
    };

    Object.entries(benchmarks).forEach(([category, benchmark]) => {
      const categoryExpenses = this.transactions
        .filter(tx => tx.category === category && tx.amount < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0) / 12;

      if (categoryExpenses > benchmark.threshold) {
        const excess = categoryExpenses - benchmark.threshold;
        this.savingsOpportunities.push({
          category,
          title: `Reduce ${category} Spending`,
          description: `Spending ${currency.format(categoryExpenses)} per month on ${category}, which is above the recommended ${(benchmark.percentage * 100).toFixed(0)}% of income.`,
          potentialSavings: excess * 12 * 0.5, // Assume 50% could be reduced
          priority: 'Low',
          actionItems: [
            `Review ${category.toLowerCase()} expenses for non-essential items`,
            'Set a monthly budget for this category',
            'Look for cheaper alternatives'
          ]
        });
      }
    });
  }

  // Calculate spending score
  calculateSpendingScore() {
    let score = 100;
    const reasons = [];

    // Check savings rate
    const totalIncome = this.monthlyCashflow.reduce((sum, m) => sum + m.income, 0);
    const totalExpenses = Math.abs(this.monthlyCashflow.reduce((sum, m) => sum + m.expenses, 0));
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;

    if (savingsRate < 0) {
      score -= 30;
      reasons.push('Spending exceeds income');
    } else if (savingsRate < 10) {
      score -= 20;
      reasons.push('Low savings rate (below 10%)');
    } else if (savingsRate < 20) {
      score -= 10;
      reasons.push('Moderate savings rate');
    } else {
      reasons.push('Good savings rate');
    }

    // Check subscription burden
    const totalSubCost = this.subscriptions.reduce((sum, s) => sum + s.annualCost, 0);
    const subPercentage = (totalSubCost / totalIncome) * 100;
    
    if (subPercentage > 5) {
      score -= 15;
      reasons.push('High subscription costs');
    } else if (subPercentage > 3) {
      score -= 5;
      reasons.push('Moderate subscription costs');
    }

    // Check anomaly count
    const highPriorityAnomalies = this.anomalies.filter(a => a.priority === 'High').length;
    if (highPriorityAnomalies > 5) {
      score -= 15;
      reasons.push('Multiple unusual transactions');
    } else if (highPriorityAnomalies > 2) {
      score -= 10;
      reasons.push('Some unusual transactions');
    }

    // Check inactive subscriptions
    const inactiveCount = this.subscriptions.filter(s => s.status === 'Inactive').length;
    if (inactiveCount > 0) {
      score -= inactiveCount * 5;
      reasons.push('Inactive subscriptions detected');
    }

    return {
      score: Math.max(0, Math.min(100, score)),
      grade: this.getScoreGrade(score),
      reasons
    };
  }

  getScoreGrade(score) {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Fair';
    if (score >= 60) return 'Needs Improvement';
    return 'Critical';
  }

  // Run full analysis
  runFullAnalysis() {
    console.log('🤖 Running AI Financial Analysis...');
    
    this.detectRecurringPayments();
    this.detectAnomalies();
    this.generateSavingsOpportunities();
    
    const spendingScore = this.calculateSpendingScore();
    const totalPotentialSavings = this.savingsOpportunities.reduce((sum, opp) => sum + opp.potentialSavings, 0);
    
    return {
      subscriptions: this.subscriptions,
      anomalies: this.anomalies,
      savingsOpportunities: this.savingsOpportunities,
      spendingScore,
      totalPotentialSavings,
      summary: {
        activeSubscriptions: this.subscriptions.filter(s => s.status === 'Active').length,
        inactiveSubscriptions: this.subscriptions.filter(s => s.status === 'Inactive').length,
        highPriorityAnomalies: this.anomalies.filter(a => a.priority === 'High').length,
        totalAnomalies: this.anomalies.length,
        topOpportunity: this.savingsOpportunities[0] || null
      }
    };
  }
}

// Initialize AI Insights View
function initAIInsights(data) {
  const ai = new AIFinancialAssistant(data.recent_transactions, data.monthly_cashflow);
  const analysis = ai.runFullAnalysis();
  
  // Update summary cards
  document.getElementById('aiPotentialSavings').textContent = 
    currency.format(analysis.totalPotentialSavings / 12) + '/mo';
  document.getElementById('aiRecurringCount').textContent = 
    analysis.summary.activeSubscriptions + ' active';
  document.getElementById('aiAnomalyCount').textContent = 
    analysis.summary.highPriorityAnomalies + ' high priority';
  document.getElementById('aiSpendingScore').textContent = 
    analysis.spendingScore.score + '/100 (' + analysis.spendingScore.grade + ')';
  
  // Render subscriptions table
  renderSubscriptionsTable(analysis.subscriptions);
  
  // Render subscription insights
  renderSubscriptionInsights(analysis.subscriptions);
  
  // Render savings opportunities
  renderSavingsOpportunities(analysis.savingsOpportunities);
  
  // Render anomalies
  renderAnomalies(analysis.anomalies, data.recent_transactions);
  
  // Render action plan
  renderActionPlan(analysis);
  
  // Initialize subcategory rules manager
  initSubcategoryManager(ai);
  
  // Initialize category trends
  initCategoryTrends(data.recent_transactions, data.monthly_cashflow);
  
  // Export functionality
  document.getElementById('exportInsights').addEventListener('click', () => {
    const exportData = {
      analysisDate: new Date().toISOString(),
      spendingScore: analysis.spendingScore,
      totalPotentialSavings: analysis.totalPotentialSavings,
      subscriptions: analysis.subscriptions,
      savingsOpportunities: analysis.savingsOpportunities,
      anomalies: analysis.anomalies.map(a => ({
        date: a.transaction.date,
        description: a.transaction.description,
        amount: a.transaction.amount,
        category: a.transaction.category,
        priority: a.priority,
        reason: a.reason
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-insights-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });
  
  // Refresh analysis button
  document.getElementById('runAIAnalysis').addEventListener('click', () => {
    initAIInsights(data);
  });
  
  return analysis;
}

function renderSubscriptionsTable(subscriptions) {
  const tbody = document.querySelector('#subscriptionTable tbody');
  if (!tbody) return;
  
  tbody.innerHTML = subscriptions.map(sub => {
    const statusClass = sub.status === 'Active' ? 'status-active' : 
                       sub.status === 'Inactive' ? 'status-inactive' : 'status-warning';
    const lastSeenDate = new Date(sub.lastSeen).toLocaleDateString('en-AU');
    
    return `
      <tr>
        <td><strong>${sub.merchant}</strong></td>
        <td>${sub.category}</td>
        <td>${sub.subcategory}</td>
        <td>${sub.frequency}</td>
        <td>${currencyPrecise.format(sub.avgAmount)}</td>
        <td><strong>${currency.format(sub.annualCost)}</strong></td>
        <td>${lastSeenDate}</td>
        <td><span class="status-badge ${statusClass}">${sub.status}</span></td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn" data-action="view-sub-details" data-merchant="${sub.merchant}">
              View Details
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
  
  // Add event listeners
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="view-sub-details"]');
    if (btn) {
      const merchant = btn.dataset.merchant;
      const sub = subscriptions.find(s => s.merchant === merchant);
      showSubscriptionDetails(sub);
    }
  });
}

function renderSubscriptionInsights(subscriptions) {
  const container = document.getElementById('subscriptionInsights');
  if (!container) return;
  
  const active = subscriptions.filter(s => s.status === 'Active');
  const inactive = subscriptions.filter(s => s.status === 'Inactive');
  const totalAnnual = active.reduce((sum, s) => sum + s.annualCost, 0);
  const avgMonthly = totalAnnual / 12;
  
  const insights = [];
  
  if (active.length > 0) {
    insights.push(`📊 You have <strong>${active.length}</strong> active recurring payments costing <strong>${currency.format(totalAnnual)}</strong> annually (${currency.format(avgMonthly)}/month).`);
  }
  
  if (inactive.length > 0) {
    insights.push(`⚠️ Found <strong>${inactive.length}</strong> inactive subscriptions that may need cancellation.`);
  }
  
  if (active.length >= 5) {
    insights.push(`💡 With ${active.length} subscriptions, consider consolidating services or sharing family plans to reduce costs.`);
  }
  
  const highCostSubs = active.filter(s => s.annualCost > 500);
  if (highCostSubs.length > 0) {
    insights.push(`💰 ${highCostSubs.length} subscription(s) cost over $500 annually. Review these for potential savings.`);
  }
  
  container.innerHTML = `
    <div class="insights-box">
      ${insights.map(i => `<p>${i}</p>`).join('')}
    </div>
  `;
}

function renderSavingsOpportunities(opportunities) {
  const container = document.getElementById('savingsOpportunities');
  if (!container) return;
  
  if (opportunities.length === 0) {
    container.innerHTML = '<div class="helper-box"><p>🎉 Great job! No major savings opportunities detected. Your spending is well-optimized!</p></div>';
    return;
  }
  
  container.innerHTML = opportunities.map((opp, index) => {
    const priorityClass = `priority-${opp.priority.toLowerCase()}`;
    const monthlySavings = opp.potentialSavings / 12;
    
    return `
      <div class="savings-card ${priorityClass}">
        <div class="savings-card-header">
          <div>
            <span class="priority-badge ${priorityClass}">${opp.priority} Priority</span>
            <h3>${opp.title}</h3>
            <p class="savings-category">${opp.category}</p>
          </div>
          <div class="savings-amount">
            <div class="amount-large">${currency.format(monthlySavings)}</div>
            <div class="amount-label">per month</div>
            <div class="amount-small">${currency.format(opp.potentialSavings)} annually</div>
          </div>
        </div>
        <p class="savings-description">${opp.description}</p>
        <div class="action-items">
          <strong>Action Steps:</strong>
          <ul>
            ${opp.actionItems.map(item => `<li>${item}</li>`).join('')}
          </ul>
        </div>
      </div>
    `;
  }).join('');
}

function showAnomalyDetailModal(anomaly, allTransactions) {
  const tx = anomaly.transaction;
  
  // Find related transactions (same category/subcategory in similar time period)
  const txDate = new Date(tx.date);
  const startDate = new Date(txDate);
  startDate.setMonth(startDate.getMonth() - 3);
  const endDate = new Date(txDate);
  endDate.setMonth(endDate.getMonth() + 3);
  
  const relatedTransactions = allTransactions.filter(t => {
    const tDate = new Date(t.date);
    return t.category === tx.category && 
           t.subcategory === tx.subcategory &&
           tDate >= startDate && 
           tDate <= endDate;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));
  
  // Calculate statistics for this category/subcategory
  const amounts = relatedTransactions.map(t => Math.abs(t.amount));
  const avgAmount = amounts.length > 0 ? amounts.reduce((a, b) => a + b, 0) / amounts.length : 0;
  const minAmount = amounts.length > 0 ? Math.min(...amounts) : 0;
  const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 0;
  
  // Create modal
  const modal = document.createElement('div');
  modal.className = 'transaction-detail-modal';
  
  const priorityClass = `priority-${anomaly.priority.toLowerCase()}`;
  const date = new Date(tx.date).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
  
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>⚠️ Unusual Transaction Details</h2>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="anomaly-card ${priorityClass}" style="margin-bottom: 2rem;">
          <div class="anomaly-header">
            <span class="priority-badge ${priorityClass}">${anomaly.priority} Priority</span>
            <span class="anomaly-date">${date}</span>
          </div>
          <div class="anomaly-transaction">
            <div class="anomaly-merchant">${tx.description}</div>
            <div class="anomaly-amount">${currencyPrecise.format(tx.amount)}</div>
          </div>
          <div class="anomaly-category">${tx.category} > ${tx.subcategory}</div>
          <div class="anomaly-reason">
            <strong>Why flagged:</strong> ${anomaly.reason}
            ${anomaly.expectedRange ? `<br><small>Expected range: ${anomaly.expectedRange}</small>` : ''}
            ${anomaly.deviation ? `<br><small>Deviation from average: ${anomaly.deviation}</small>` : ''}
          </div>
        </div>
        
        <div class="category-summary-stats">
          <div class="stat-box">
            <div class="stat-label">This Transaction</div>
            <div class="stat-value negative">${currencyPrecise.format(Math.abs(tx.amount))}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Category Average</div>
            <div class="stat-value">${currencyPrecise.format(avgAmount)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Typical Range</div>
            <div class="stat-value">${currencyPrecise.format(minAmount)} - ${currencyPrecise.format(maxAmount)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Related Transactions</div>
            <div class="stat-value">${relatedTransactions.length}</div>
          </div>
        </div>
        
        <div class="transaction-detail-list">
          <h3>Recent ${tx.category} > ${tx.subcategory} Transactions (±3 months)</h3>
          <p style="color: var(--muted); font-size: 0.9rem; margin-bottom: 1rem;">
            Compare this flagged transaction with other transactions in the same category to understand the pattern.
          </p>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Note</th>
                </tr>
              </thead>
              <tbody>
                ${relatedTransactions.length > 0 ? relatedTransactions.map(t => {
                    const tDate = new Date(t.date).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' });
                    const amountClass = t.amount < 0 ? 'variance-negative' : 'variance-positive';
                    const isCurrentTx = t.id === tx.id;
                    const rowStyle = isCurrentTx ? 'style="background: rgba(251, 146, 60, 0.15); font-weight: 600;"' : '';
                    const note = isCurrentTx ? '👈 Flagged transaction' : '';
                    
                    return `
                      <tr ${rowStyle}>
                        <td>${tDate}</td>
                        <td>${t.description}</td>
                        <td class="${amountClass}">${currencyPrecise.format(t.amount)}</td>
                        <td style="color: var(--negative);">${note}</td>
                      </tr>
                    `;
                  }).join('') : '<tr><td colspan="4">No related transactions found</td></tr>'}
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="insights-box" style="margin-top: 2rem;">
          <strong>💡 What to do next:</strong>
          <ul style="margin: 0.75rem 0 0 1.5rem; padding: 0;">
            <li>Verify this transaction is legitimate and not a duplicate</li>
            <li>Check if this is a one-time expense or a recurring pattern</li>
            <li>Consider if this category needs budget adjustment</li>
            <li>Review if the merchant or description needs recategorization</li>
          </ul>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  // Add event listeners to close modal
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  
  const closeModal = () => {
    modal.remove();
  };
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  // Close on Escape key
  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  };
  document.addEventListener('keydown', handleEscape);
  
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden';
  modal.addEventListener('remove', () => {
    document.body.style.overflow = '';
  });
}

function renderAnomalies(anomalies, allTransactions) {
  const container = document.getElementById('anomaliesList');
  if (!container) return;
  
  const showAllCheckbox = document.getElementById('showAllAnomalies');
  const showHighOnlyCheckbox = document.getElementById('showHighOnly');
  
  // Store filtered anomalies in a variable accessible to event handlers
  let currentFiltered = anomalies;
  
  function render() {
    let filtered = anomalies;
    if (showHighOnlyCheckbox?.checked) {
      filtered = anomalies.filter(a => a.priority === 'High');
    }
    
    // Update the reference that event handlers will use
    currentFiltered = filtered;
    
    if (filtered.length === 0) {
      container.innerHTML = '<div class="helper-box"><p>✅ No unusual spending patterns detected!</p></div>';
      return;
    }
    
    container.innerHTML = filtered.map((anomaly, index) => {
      const priorityClass = `priority-${anomaly.priority.toLowerCase()}`;
      const tx = anomaly.transaction;
      const date = new Date(tx.date).toLocaleDateString('en-AU');
      
      return `
        <div class="anomaly-card ${priorityClass} clickable-card" data-anomaly-index="${index}" style="cursor: pointer;">
          <div class="anomaly-header">
            <span class="priority-badge ${priorityClass}">${anomaly.priority}</span>
            <span class="anomaly-date">${date}</span>
          </div>
          <div class="anomaly-transaction">
            <div class="anomaly-merchant">${tx.description}</div>
            <div class="anomaly-amount">${currencyPrecise.format(tx.amount)}</div>
          </div>
          <div class="anomaly-category">${tx.category} > ${tx.subcategory}</div>
          <div class="anomaly-reason">
            <strong>Why flagged:</strong> ${anomaly.reason}
            ${anomaly.expectedRange ? `<br><small>Expected range: ${anomaly.expectedRange}</small>` : ''}
          </div>
          <div style="text-align: center; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); color: var(--accent); font-size: 0.85rem;">
            Click to see full details and related transactions
          </div>
        </div>
      `;
    }).join('');
    
    // Attach click handlers to anomaly cards
    container.querySelectorAll('.anomaly-card.clickable-card').forEach(card => {
      card.addEventListener('click', () => {
        const index = parseInt(card.getAttribute('data-anomaly-index'));
        const anomaly = currentFiltered[index];
        showAnomalyDetailModal(anomaly, allTransactions);
      });
    });
  }
  
  render();
  
  if (showAllCheckbox) {
    showAllCheckbox.addEventListener('change', () => {
      if (showAllCheckbox.checked) showHighOnlyCheckbox.checked = false;
      render();
    });
  }
  
  if (showHighOnlyCheckbox) {
    showHighOnlyCheckbox.addEventListener('change', () => {
      if (showHighOnlyCheckbox.checked) showAllCheckbox.checked = false;
      render();
    });
  }
}

function renderActionPlan(analysis) {
  const container = document.getElementById('actionPlan');
  if (!container) return;
  
  const actions = [];
  
  // Top 3 savings opportunities
  analysis.savingsOpportunities.slice(0, 3).forEach((opp, index) => {
    actions.push({
      priority: index + 1,
      title: opp.title,
      impact: currency.format(opp.potentialSavings / 12) + '/month',
      category: opp.category,
      steps: opp.actionItems.slice(0, 2) // Top 2 action items
    });
  });
  
  // High priority anomalies
  const highAnomalies = analysis.anomalies.filter(a => a.priority === 'High').slice(0, 2);
  highAnomalies.forEach(anomaly => {
    actions.push({
      priority: actions.length + 1,
      title: 'Review Unusual Transaction',
      impact: 'Risk mitigation',
      category: anomaly.transaction.category,
      steps: [
        `Check ${anomaly.transaction.description}`,
        `Verify amount: ${currencyPrecise.format(anomaly.transaction.amount)}`
      ]
    });
  });
  
  if (actions.length === 0) {
    container.innerHTML = '<div class="helper-box"><p>🎉 No immediate actions required. Your finances are in good shape!</p></div>';
    return;
  }
  
  container.innerHTML = `
    <div class="action-plan-grid">
      ${actions.map(action => `
        <div class="action-plan-card">
          <div class="action-priority">#${action.priority}</div>
          <h4>${action.title}</h4>
          <div class="action-meta">
            <span class="action-impact">${action.impact}</span>
            <span class="action-category">${action.category}</span>
          </div>
          <div class="action-steps">
            <strong>Quick Steps:</strong>
            <ol>
              ${action.steps.map(step => `<li>${step}</li>`).join('')}
            </ol>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function showSubscriptionDetails(subscription) {
  const modal = document.createElement('div');
  modal.className = 'transaction-detail-modal';
  
  const transactions = subscription.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h2>${subscription.merchant}</h2>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <div class="subscription-detail-stats">
          <div class="stat-box">
            <div class="stat-label">Frequency</div>
            <div class="stat-value">${subscription.frequency}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Average Amount</div>
            <div class="stat-value">${currencyPrecise.format(subscription.avgAmount)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Annual Cost</div>
            <div class="stat-value">${currency.format(subscription.annualCost)}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Status</div>
            <div class="stat-value status-badge status-${subscription.status.toLowerCase()}">${subscription.status}</div>
          </div>
        </div>
        <div class="subscription-history">
          <h3>Payment History (${transactions.length} transactions)</h3>
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Days Since Last</th>
                </tr>
              </thead>
              <tbody>
                ${transactions.map((tx, index) => {
                  const daysSinceLast = index < transactions.length - 1
                    ? Math.round((new Date(transactions[index].date) - new Date(transactions[index + 1].date)) / (1000 * 60 * 60 * 24))
                    : '-';
                  return `
                    <tr>
                      <td>${new Date(tx.date).toLocaleDateString('en-AU')}</td>
                      <td>${currencyPrecise.format(tx.amount)}</td>
                      <td>${daysSinceLast !== '-' ? daysSinceLast + ' days' : '-'}</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const closeBtn = modal.querySelector('.modal-close');
  const overlay = modal.querySelector('.modal-overlay');
  
  const closeModal = () => modal.remove();
  
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', function handleEscape(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', handleEscape);
    }
  });
}

function initSubcategoryManager(ai) {
  const tbody = document.querySelector('#subcategoryRulesTable tbody');
  const addBtn = document.getElementById('addSubcategoryRule');
  
  if (!tbody || !addBtn) return;
  
  function render() {
    tbody.innerHTML = ai.subcategoryRules.map((rule, index) => `
      <tr>
        <td><strong>${rule.keyword}</strong></td>
        <td>${rule.category}</td>
        <td>${rule.subcategory}</td>
        <td>${rule.matchCount || 0} transactions</td>
        <td>
          <div class="table-actions">
            <button class="table-action-btn" data-action="edit-rule" data-index="${index}">Edit</button>
            <button class="table-action-btn delete" data-action="delete-rule" data-index="${index}">Delete</button>
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  addBtn.addEventListener('click', () => {
    const keyword = prompt('Enter merchant keyword (e.g., "NETFLIX"):');
    if (!keyword) return;
    
    const category = prompt('Enter category:');
    if (!category) return;
    
    const subcategory = prompt('Enter subcategory:');
    if (!subcategory) return;
    
    ai.subcategoryRules.push({ keyword, category, subcategory, matchCount: 0 });
    ai.saveSubcategoryRules();
    render();
    alert('Rule added! Run analysis again to apply to transactions.');
  });
  
  tbody.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    
    const index = parseInt(btn.dataset.index);
    const action = btn.dataset.action;
    
    if (action === 'delete-rule') {
      if (confirm('Delete this rule?')) {
        ai.subcategoryRules.splice(index, 1);
        ai.saveSubcategoryRules();
        render();
      }
    } else if (action === 'edit-rule') {
      const rule = ai.subcategoryRules[index];
      const keyword = prompt('Enter merchant keyword:', rule.keyword);
      if (!keyword) return;
      
      const category = prompt('Enter category:', rule.category);
      if (!category) return;
      
      const subcategory = prompt('Enter subcategory:', rule.subcategory);
      if (!subcategory) return;
      
      ai.subcategoryRules[index] = { ...rule, keyword, category, subcategory };
      ai.saveSubcategoryRules();
      render();
    }
  });
  
  render();
}

function initCategoryTrends(transactions, monthlyCashflow) {
  const select = document.getElementById('trendCategorySelect');
  const insightsDiv = document.getElementById('categoryTrendInsights');
  
  if (!select) return;
  
  // Get unique categories
  const categories = [...new Set(transactions.map(tx => tx.category))].sort();
  select.innerHTML = '<option value="">Select a category to analyze...</option>' +
    categories.map(cat => `<option value="${cat}">${cat}</option>`).join('');
  
  select.addEventListener('change', (e) => {
    const category = e.target.value;
    if (!category) {
      insightsDiv.innerHTML = '';
      return;
    }
    
    // Calculate monthly spending for this category
    const monthlyData = new Map();
    
    transactions.forEach(tx => {
      if (tx.category !== category || tx.amount >= 0) return;
      
      const month = tx.date.substring(0, 7); // YYYY-MM
      monthlyData.set(month, (monthlyData.get(month) || 0) + Math.abs(tx.amount));
    });
    
    // Sort by month
    const sorted = Array.from(monthlyData.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const labels = sorted.map(([month]) => {
      const date = new Date(month + '-01');
      return date.toLocaleDateString('en-AU', { month: 'short', year: '2-digit' });
    });
    const data = sorted.map(([, amount]) => amount);
    
    // Create chart
    destroyChart('categoryTrendCanvas');
    const ctx = document.getElementById('categoryTrendCanvas');
    if (ctx) {
      chartInstances['categoryTrendCanvas'] = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label: category,
            data,
            borderColor: 'rgba(56, 189, 248, 1)',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => currency.format(context.parsed.y)
              }
            }
          },
          scales: {
            x: {
              ticks: { color: '#94a3b8' },
              grid: { color: 'rgba(148, 163, 184, 0.1)' }
            },
            y: {
              ticks: { 
                color: '#94a3b8',
                callback: (value) => currency.format(value)
              },
              grid: { color: 'rgba(148, 163, 184, 0.1)' }
            }
          }
        }
      });
    }
    
    // Generate insights
    const avg = data.reduce((a, b) => a + b, 0) / data.length;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const latest = data[data.length - 1];
    const trend = latest > avg ? 'increasing' : 'decreasing';
    const trendPercent = ((latest - avg) / avg * 100).toFixed(1);
    
    insightsDiv.innerHTML = `
      <div class="insights-box">
        <h4>Insights for ${category}</h4>
        <ul>
          <li><strong>Average monthly:</strong> ${currency.format(avg)}</li>
          <li><strong>Range:</strong> ${currency.format(min)} to ${currency.format(max)}</li>
          <li><strong>Latest month:</strong> ${currency.format(latest)}</li>
          <li><strong>Trend:</strong> Spending is ${trend} by ${Math.abs(trendPercent)}% vs average</li>
        </ul>
      </div>
    `;
  });
}

// ==================== Main Initialization ====================

async function init() {
  try {
    const data = await loadData();
    updateGeneratedTime(data.generated_at);
    
    // Initialize navigation
    initNavigation();

    // Initialize overview filters
    initOverviewFilters(data);

    // Overview view
    renderSummary(data.metrics, data.calc_defaults);
    renderMonthlyTrendChart(data.monthly_cashflow);
    renderCategoryPieChart(data.category_summary);
    renderCategoryBars(data.category_summary.filter((row) => row.category !== 'Transfers'), data.recent_transactions);
    renderAirbnb(data.airbnb_summary);
    renderRankList(data.top_merchants, 'merchantList');
    renderIncomeList(data.top_income_sources);

    // Budget view
    const budgetState = initBudgetTable(data.budget_summary);
    renderBudgetProgressChart(budgetState);

    // Statements view
    initMonthlyStatements(data.monthly_cashflow, data.category_summary, data.recent_transactions);
    renderCashflow(data.monthly_cashflow);

    // Planning view
    initFortnightCalculator(data.calc_defaults);
    initSavingsCalculator(data.calc_defaults);
    initDebtCalculator();
    initAirbnbBuffer(data.calc_defaults, data.airbnb_summary);
    initRetirementCalculator();
    initScenarioModeler(data.calc_defaults);

    // Transactions view
    renderTransactions(data.recent_transactions);

    // Category Manager view
    initCategoryManager(data.recent_transactions);

    // AI Insights view
    initAIInsights(data);

    // Data management
    initDataManagement(data);

  } catch (error) {
    console.error(error);
    const app = document.getElementById('app');
    if (app) {
      app.innerHTML = `<section class="card"><h2>Something went wrong</h2><p>${error.message}</p></section>`;
    }
  }
}

init();