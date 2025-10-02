/**
 * Data Storage Utility
 * Provides localStorage-based persistence for all app data
 */

const STORAGE_KEYS = {
  DASHBOARD_PROFILE: 'superannuation_dashboard_profile',
  RETIREMENT_PLANNER: 'superannuation_retirement_planner',
  RETIREMENT_SCENARIOS: 'superannuation_retirement_scenarios',
  PROJECTION_CALCULATOR: 'superannuation_projection_calculator',
  RETIREMENT_INCOME: 'superannuation_retirement_income',
  TAX_BENEFITS: 'superannuation_tax_benefits',
  MINIMUM_DRAWDOWN: 'superannuation_minimum_drawdown',
  LAST_ACTIVE_TAB: 'superannuation_last_active_tab'
};

/**
 * Generic function to save data to localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to save
 */
export const saveData = (key, data) => {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    return false;
  }
};

/**
 * Generic function to load data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 * @returns {any} Loaded data or default value
 */
export const loadData = (key, defaultValue = null) => {
  try {
    const serialized = localStorage.getItem(key);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized);
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Clear specific data from localStorage
 * @param {string} key - Storage key
 */
export const clearData = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error clearing data from localStorage:', error);
    return false;
  }
};

/**
 * Clear all app data from localStorage
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Error clearing all data from localStorage:', error);
    return false;
  }
};

/**
 * Export all data for backup
 * @returns {object} All stored data
 */
export const exportAllData = () => {
  const data = {};
  Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
    const value = loadData(key);
    if (value !== null) {
      data[name] = value;
    }
  });
  return data;
};

/**
 * Import data from backup
 * @param {object} data - Data to import
 */
export const importAllData = (data) => {
  try {
    Object.entries(data).forEach(([name, value]) => {
      const key = STORAGE_KEYS[name];
      if (key) {
        saveData(key, value);
      }
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
};

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Export storage keys for direct use in components
export { STORAGE_KEYS };
