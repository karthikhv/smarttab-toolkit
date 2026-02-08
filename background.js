/**
 * SmartTab Toolkit - Background Service Worker
 * Handles background operations and message routing
 */

// ============================================
// Install Event
// ============================================

chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        console.log('SmartTab Toolkit installed successfully');
        
        // Open onboarding or welcome page (optional)
        // chrome.tabs.create({ url: 'welcome.html' });
    } else if (details.reason === 'update') {
        console.log('SmartTab Toolkit updated');
    }
});

// ============================================
// Message Handler
// ============================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTabId') {
        // Send current tab ID to content script
        if (sender.tab) {
            sendResponse({ tabId: sender.tab.id });
        } else {
            sendResponse({ tabId: null });
        }
    }
    
    // Return true if we'll send response asynchronously (not needed here)
    return false;
});

// ============================================
// Context Menu (Future Feature)
// ============================================

// Create context menu items for future expansion
chrome.runtime.onInstalled.addListener(() => {
    // This can be expanded for future features
    // like quick note creation from context menu
});

// ============================================
// Storage Management (Future Feature)
// ============================================

/**
 * Future: Function to manage storage cleanup
 * Remove notes older than X days
 */
function cleanupOldNotes(daysOld = 30) {
    // This can be implemented later
    console.log('SmartTab: Storage cleanup feature coming soon');
}

// ============================================
// Periodic Tasks (Future Feature)
// ============================================

/**
 * Listen for alarm-based tasks
 * Can be used for periodic cleanup or sync
 */
chrome.alarms?.onAlarm.addListener?.((alarm) => {
    if (alarm.name === 'cleanup') {
        console.log('SmartTab: Running cleanup task');
        cleanupOldNotes();
    }
});

// ============================================
// Tab Management
// ============================================

// Optional: Clean up notes when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    // Optional: You might want to keep notes even after tab closes
    // Or implement a cleanup strategy here
    console.log(`SmartTab: Tab ${tabId} closed`);
});


chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.action === 'requestNoteForTab') {
        try {
            const tabId = sender.tab.id;
            const storageKey = `note_${tabId}`;
            const data = await chrome.storage.local.get([storageKey]);
            sendResponse({ noteContent: data[storageKey] || '' });
        } catch (e) {
            console.error(e);
            sendResponse({ noteContent: '' });
        }
        return true; // Indicates async response
    }
});

// ============================================
// Extension Disabled/Enabled
// ============================================

chrome.runtime.onSuspend?.addListener?.(() => {
    console.log('SmartTab: Service worker suspending');
});

chrome.runtime.onSuspendCanceled?.addListener?.(() => {
    console.log('SmartTab: Service worker resume');
});

// ============================================
// Error Handling
// ============================================

// Log any uncaught errors
self.addEventListener('error', (event) => {
    console.error('SmartTab background error:', event.error);
});

// Handle promise rejections
self.addEventListener('unhandledrejection', (event) => {
    console.error('SmartTab unhandled rejection:', event.reason);
});

// ============================================
// Future Expansion Hooks
// ============================================

/**
 * Future features that can be added:
 * 1. Cloud sync of notes across devices
 * 2. Note categories/tags
 * 3. Search functionality
 * 4. Statistics (most opened tabs, etc.)
 * 5. Integration with task managers
 * 6. Automatic note templates
 * 7. Share notes feature
 * 8. Note reminders
 */

console.log('SmartTab Toolkit background service worker loaded');


