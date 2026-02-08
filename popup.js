/**
 * SmartTab Toolkit - Popup Script
 * Handles UI interactions, note loading, and persistence
 */

// ============================================
// DOM Elements
// ============================================

const noteInput = document.getElementById('noteInput');
const noteForm = document.getElementById('noteForm');
const clearBtn = document.getElementById('clearBtn');
const feedbackText = document.getElementById('feedbackText');
const feedback = document.getElementById('feedback');
const charCount = document.getElementById('charCount');
const tabUrl = document.getElementById('tabUrl');
const themeToggle = document.getElementById('themeToggle');
const themeCheckbox = document.getElementById('themeCheckbox');
const savedNotesSection = document.getElementById('savedNotesSection');
const tabsContent = document.getElementById('tabsContent');
const clearAllBtn = document.getElementById('clearAllBtn');

// ============================================
// State Management
// ============================================

let currentTab = null;
let isModified = false;

// ============================================
// Initialize Popup
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize dark mode preference
        initializeThemeMode();

        // Get current tab information
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length === 0) {
            showFeedback('Unable to load tab information', 'error');
            return;
        }

        currentTab = tabs[0];

        // Display tab URL
        displayTabUrl(currentTab.url || currentTab.title || 'Unknown Tab');

        // Load note for this tab
        await loadNoteForTab(currentTab);

        isModified = false;

    } catch (error) {
        console.error('Error initializing popup:', error);
        showFeedback('Error loading tab data', 'error');
    }
});

// ============================================
// Theme Mode Management
// ============================================

function initializeThemeMode() {
    chrome.storage.local.get(['theme-preference'], (result) => {
        const preference = result['theme-preference'] || 'system';
        applyThemePreference(preference);
    });
}

function applyThemePreference(preference) {
    document.body.classList.remove('dark-mode', 'light-mode');
    themeToggle.classList.remove('active');

    if (preference === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.classList.add('active');
        themeCheckbox.checked = true;
    } else if (preference === 'light') {
        document.body.classList.add('light-mode');
        themeCheckbox.checked = false;
    } else {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeToggle.classList.add('active');
            themeCheckbox.checked = true;
        } else {
            document.body.classList.add('light-mode');
            themeCheckbox.checked = false;
        }
    }
}

themeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode', !isDarkMode);
    themeToggle.classList.toggle('active', isDarkMode);
    themeCheckbox.checked = isDarkMode;

    chrome.storage.local.set({ 'theme-preference': isDarkMode ? 'dark' : 'light' });
});

themeToggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        themeToggle.click();
    }
});

// ============================================
// Load Note for Current Tab
// ============================================

async function loadNoteForTab(tab) {
    try {
        const storageKey = `note_${encodeURIComponent(tab.url)}`;
        const data = await chrome.storage.local.get([storageKey]);
        noteInput.value = data[storageKey] || '';
        updateCharCount();
        noteInput.focus();
    } catch (error) {
        console.error('Error loading note:', error);
    }
}

// ============================================
// Display Tab URL
// ============================================

function displayTabUrl(url) {
    let displayUrl = url;
    try {
        const urlObj = new URL(url);
        displayUrl = urlObj.hostname || url;
    } catch (e) {
        displayUrl = url.substring(0, 50);
    }
    tabUrl.textContent = displayUrl;
    tabUrl.title = url;
}

// ============================================
// Save Note
// ============================================

noteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentTab) return showFeedback('Cannot save: tab info unavailable', 'error');

    try {
        const noteContent = noteInput.value.trim();
        const storageKey = `note_${encodeURIComponent(currentTab.url)}`;

        if (noteContent === '') {
            await chrome.storage.local.remove([storageKey, `${storageKey}_timestamp`]);
        } else {
            await chrome.storage.local.set({
                [storageKey]: noteContent,
                [`${storageKey}_timestamp`]: new Date().toISOString()
            });
        }

        isModified = false;
        showFeedback('Saved! ✓', 'success');
        updateCharCount();

        // Update sticky note on page
        try {
            await chrome.tabs.sendMessage(currentTab.id, {
                action: 'noteUpdated',
                noteContent: noteContent
            });
        } catch (e) {
            console.log('Content script not available for this tab');
        }

    } catch (error) {
        console.error('Error saving note:', error);
        showFeedback('Failed to save. Please try again.', 'error');
    }
});

// ============================================
// Clear Note
// ============================================

clearBtn.addEventListener('click', async () => {
    if (!currentTab) return showFeedback('Cannot clear: tab info unavailable', 'error');

    const storageKey = `note_${encodeURIComponent(currentTab.url)}`;

    try {
        await chrome.storage.local.remove([storageKey, `${storageKey}_timestamp`]);
        noteInput.value = '';
        updateCharCount();
        isModified = true;

        showFeedback('Cleared!', 'success');

        // Notify content script
        try {
            await chrome.tabs.sendMessage(currentTab.id, {
                action: 'noteUpdated',
                noteContent: ''
            });
        } catch (e) {
            console.log('Content script not available for this tab');
        }

        noteInput.focus();
    } catch (error) {
        console.error('Error clearing note:', error);
    }
});

// ============================================
// Track Modifications & Char Count
// ============================================

noteInput.addEventListener('input', () => {
    isModified = true;
    updateCharCount();
});

function updateCharCount() {
    const length = noteInput.value.length;
    charCount.textContent = length;

    const countContainer = document.querySelector('.char-count');
    countContainer.classList.remove('warning', 'critical');

    if (length > 900) countContainer.classList.add('critical');
    else if (length > 750) countContainer.classList.add('warning');
}

// ============================================
// Feedback
// ============================================

function showFeedback(message, type = 'success') {
    feedbackText.textContent = message;
    feedbackText.className = `feedback-text show ${type}`;
    setTimeout(() => feedbackText.classList.remove('show'), 2500);
}

// ============================================
// Auto-resize Textarea
// ============================================

function autoResizeTextarea() {
    noteInput.style.height = 'auto';
    noteInput.style.height = Math.min(noteInput.scrollHeight, 240) + 'px';
}
noteInput.addEventListener('input', autoResizeTextarea);

// ============================================
// Keyboard Shortcuts
// ============================================

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        noteForm.dispatchEvent(new Event('submit'));
    }
});

// Tab key inserts tab character
noteInput.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = noteInput.selectionStart;
        const end = noteInput.selectionEnd;
        noteInput.value = noteInput.value.substring(0, start) + '\t' + noteInput.value.substring(end);
        noteInput.selectionStart = noteInput.selectionEnd = start + 1;
        updateCharCount();
    }
});

// ============================================
// Clear All Notes (optional)
clearAllBtn.addEventListener('click', async () => {
    if (!confirm('Delete ALL saved notes? This cannot be undone.')) return;

    try {
        const allData = await chrome.storage.local.get(null);
        const keysToDelete = Object.keys(allData).filter(k => k.startsWith('note_'));
        if (keysToDelete.length) {
            await chrome.storage.local.remove(keysToDelete);
            showFeedback('All notes cleared!', 'success');
        }
    } catch (error) {
        console.error('Error clearing all notes:', error);
        showFeedback('Failed to clear notes', 'error');
    }
});

// content.js

// Function to create or update sticky note
function createOrUpdateSticky(noteContent, theme) {
    let noteDiv = document.getElementById('smarttab-sticky-note');

    if (!noteDiv) {
        noteDiv = document.createElement('div');
        noteDiv.id = 'smarttab-sticky-note';
        document.body.appendChild(noteDiv);

        // Make draggable
        noteDiv.onmousedown = function(event) {
            let shiftX = event.clientX - noteDiv.getBoundingClientRect().left;
            let shiftY = event.clientY - noteDiv.getBoundingClientRect().top;

            function moveAt(pageX, pageY) {
                noteDiv.style.left = pageX - shiftX + 'px';
                noteDiv.style.top = pageY - shiftY + 'px';
            }

            function onMouseMove(event) {
                moveAt(event.pageX, event.pageY);
            }

            document.addEventListener('mousemove', onMouseMove);

            noteDiv.onmouseup = function() {
                document.removeEventListener('mousemove', onMouseMove);
                noteDiv.onmouseup = null;
            };
        };

        noteDiv.ondragstart = () => false;
    }

    // Set content
    noteDiv.textContent = noteContent;

    // Theme colors
    if (theme === 'dark') {
        noteDiv.style.backgroundColor = 'rgba(50,50,50,0.9)';
        noteDiv.style.color = 'white';
    } else {
        noteDiv.style.backgroundColor = 'rgba(255,255,0,0.9)';
        noteDiv.style.color = 'black';
    }

    // Style common properties
    Object.assign(noteDiv.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        zIndex: 9999,
        cursor: 'move',
        maxWidth: '250px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'Arial, sans-serif',
    });
}

// Load note for current tab
chrome.storage.local.get(['theme-preference'], (themeData) => {
    const theme = themeData['theme-preference'] || 'system';
    const dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Determine tab ID by listening to messages
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.action === 'noteUpdated') {
            createOrUpdateSticky(msg.noteContent, dark ? 'dark' : 'light');
        }
    });

    // Load existing note for this tab if any
    chrome.runtime.sendMessage({ action: 'requestNoteForTab' }, (response) => {
        if (response && response.noteContent) {
            createOrUpdateSticky(response.noteContent, dark ? 'dark' : 'light');
        }
    });
});
