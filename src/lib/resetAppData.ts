/**
 * Utility to reset application data in localStorage
 * Can be used when app is in a broken state due to corrupted data
 */

// Storage keys used in the app
const STORAGE_KEYS = [
  'emotion_logs',
  'app_kids_data',
  'app_selected_kid',
  'emotion_tracker_current_user'
];

/**
 * Resets all application data in localStorage
 */
export function resetAllAppData(): boolean {
  try {
    console.log('Resetting all application data...');
    
    // Clear all app-related localStorage keys
    STORAGE_KEYS.forEach(key => {
      localStorage.removeItem(key);
      console.log(`Cleared ${key} from localStorage`);
    });
    
    // Alternatively, to clear everything:
    // localStorage.clear();
    
    console.log('All application data has been reset. Reloading page...');
    
    // Reload the page to reinitialize everything
    window.location.reload();
    
    return true;
  } catch (error) {
    console.error('Error resetting application data:', error);
    return false;
  }
}

/**
 * Function to be called from the browser console for debugging
 */
if (typeof window !== 'undefined') {
  (window as any).resetAppData = resetAllAppData;
}

export default resetAllAppData; 