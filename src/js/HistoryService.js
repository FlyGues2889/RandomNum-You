/**
 * History Service
 * Manages the history of random number picks
 */

class HistoryService {
  constructor() {
    this.HISTORY_KEY = 'random_picker_history';
    this.history = this.loadHistory();
  }

  /**
   * Save a new entry to history
   * @param {Object} entry - The entry to add to history
   * @param {number} entry.number - The picked number
   * @param {string} entry.timestamp - The timestamp of the pick
   */
  addToHistory(entry) {
    const newEntry = {
      number: entry.number,
      timestamp: entry.timestamp || new Date().toLocaleString()
    };
    
    this.history.unshift(newEntry); // Add to beginning of array
    
    // Limit history to 100 entries to prevent storage bloat
    if (this.history.length > 100) {
      this.history = this.history.slice(0, 100);
    }
    
    this.saveHistory();
    return newEntry;
  }

  /**
   * Get all history entries
   * @returns {Array} Array of history entries
   */
  getHistory() {
    return this.history;
  }

  /**
   * Clear all history
   */
  clearHistory() {
    this.history = [];
    this.saveHistory();
  }

  /**
   * Save history to local storage
   */
  saveHistory() {
    try {
      localStorage.setItem(this.HISTORY_KEY, JSON.stringify(this.history));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }

  /**
   * Load history from local storage
   * @returns {Array} Array of history entries
   */
  loadHistory() {
    try {
      const historyStr = localStorage.getItem(this.HISTORY_KEY);
      if (historyStr) {
        return JSON.parse(historyStr);
      }
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
    }
    return [];
  }
}

export default new HistoryService();