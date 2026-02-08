/**
 * SmartTab Toolkit - Content Script
 * Displays draggable sticky notes on pages with saved notes
 */

// ============================================
// Constants
// ============================================

const STICKY_NOTE_ID = 'smarttab-sticky-note';
const STORAGE_KEY_PREFIX = 'note_';
const POSITION_STORAGE_KEY = 'note-position';

// ============================================
// Initialize Content Script
// ============================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadAndDisplayNote);
} else {
    loadAndDisplayNote();
}

// ============================================
// Load and Display Note
// ============================================

async function loadAndDisplayNote() {
    try {
        const tabId = await getCurrentTabId();
        
        if (!tabId) {
            console.log('SmartTab: Unable to determine tab ID');
            return;
        }
        
        const storageKey = `${STORAGE_KEY_PREFIX}${tabId}`;
        const data = await chrome.storage.local.get([storageKey]);
        
        if (data[storageKey]) {
            displayStickyNote(data[storageKey], tabId);
        }
        
    } catch (error) {
        console.error('SmartTab: Error loading note:', error);
    }
}

// ============================================
// Get Current Tab ID
// ============================================

async function getCurrentTabId() {
    try {
        const response = await chrome.runtime.sendMessage({ action: 'getTabId' });
        return response.tabId;
    } catch (error) {
        console.log('SmartTab: Could not get tab ID');
        return null;
    }
}

// ============================================
// Display Sticky Note on Page
// ============================================

function displayStickyNote(noteContent, tabId) {
    if (shouldSkipStickyNote()) {
        return;
    }
    
    removeExistingStickyNote();
    
    // Inject styles first
    injectStickyNoteStyles();
    
    // Create sticky note container
    const stickyNote = document.createElement('div');
    stickyNote.id = STICKY_NOTE_ID;
    stickyNote.className = 'smarttab-sticky-note';
    stickyNote.setAttribute('role', 'complementary');
    stickyNote.setAttribute('aria-label', 'Tab note from SmartTab Toolkit');
    
    // Create note content
    const noteText = document.createElement('p');
    noteText.className = 'smarttab-note-text';
    noteText.textContent = noteContent;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'smarttab-close-btn';
    closeBtn.setAttribute('aria-label', 'Close note');
    closeBtn.innerHTML = '×';
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        removeExistingStickyNote();
    });
    
    // Assemble note
    stickyNote.appendChild(noteText);
    stickyNote.appendChild(closeBtn);
    
    // Add to document
    document.body.appendChild(stickyNote);
    
    // Make draggable
    makeStickyNoteDraggable(stickyNote, tabId);
    
    // Trigger animation
    requestAnimationFrame(() => {
        stickyNote.classList.add('smarttab-visible');
    });
}

// ============================================
// Make Sticky Note Draggable
// ============================================

function makeStickyNoteDraggable(element, tabId) {
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    
    // Get saved position
    const positionKey = `${POSITION_STORAGE_KEY}_${tabId}`;
    
    chrome.storage.local.get([positionKey], (result) => {
        if (result[positionKey]) {
            const pos = result[positionKey];
            element.style.left = pos.x + 'px';
            element.style.top = pos.y + 'px';
            element.style.right = 'auto';
        }
    });
    
    element.addEventListener('mousedown', startDrag);
    
    function startDrag(e) {
        if (e.target.classList.contains('smarttab-close-btn')) {
            return;
        }
        
        isDragging = true;
        initialX = e.clientX - element.offsetLeft;
        initialY = e.clientY - element.offsetTop;
        element.classList.add('smarttab-dragging');
        
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        e.preventDefault();
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        
        element.style.left = currentX + 'px';
        element.style.top = currentY + 'px';
        element.style.right = 'auto';
    }
    
    function stopDrag() {
        isDragging = false;
        element.classList.remove('smarttab-dragging');
        
        chrome.storage.local.set({
            [positionKey]: { x: currentX, y: currentY }
        });
        
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }
}

function showStickyNote(noteContent, theme) {
    if (!noteContent) return;

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

    // Apply theme
    if (theme === 'dark') {
        noteDiv.style.backgroundColor = 'rgba(50,50,50,0.9)';
        noteDiv.style.color = 'white';
    } else {
        noteDiv.style.backgroundColor = 'rgba(255,255,0,0.9)';
        noteDiv.style.color = 'black';
    }

    // Apply styling
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

    noteDiv.textContent = noteContent;
}

// Load note for this tab
/*
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    const storageKey = `note_${tabId}`;

    chrome.storage.local.get([storageKey, 'theme-preference'], (data) => {
        const noteContent = data[storageKey] || '';
        let theme = data['theme-preference'] || 'system';
        if (theme === 'system') {
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        showStickyNote(noteContent, theme);
    });
});
*/

// Listen for updates from popup
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.action === 'noteUpdated') {
        chrome.storage.local.get(['theme-preference'], (data) => {
            let theme = data['theme-preference'] || 'system';
            if (theme === 'system') {
                theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }
            showStickyNote(msg.noteContent, theme);
        });
    }
});

// ============================================
// Inject Sticky Note Styles
// ============================================

function injectStickyNoteStyles() {
    if (document.getElementById('smarttab-sticky-styles')) {
        return;
    }
    
    const styles = document.createElement('style');
    styles.id = 'smarttab-sticky-styles';
    styles.textContent = `
        .smarttab-sticky-note {
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 320px;
            width: 100%;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(249, 250, 251, 0.98));
            backdrop-filter: blur(8px);
            border: 1px solid rgba(226, 232, 240, 0.8);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 10px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #2d3748;
            animation: smarttab-slideIn 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            opacity: 0;
            transform: translateX(20px);
            transition: opacity 0.3s ease-out, transform 0.3s ease-out;
            cursor: grab;
            user-select: none;
        }

        .smarttab-sticky-note.smarttab-visible {
            opacity: 1;
            transform: translateX(0);
        }

        .smarttab-sticky-note.smarttab-closing {
            opacity: 0;
            transform: translateX(20px);
        }
        
        .smarttab-sticky-note.smarttab-dragging {
            box-shadow: 0 20px 48px rgba(0, 0, 0, 0.25), 0 4px 12px rgba(0, 0, 0, 0.12);
            cursor: grabbing;
            z-index: 9999999;
        }

        .smarttab-note-text {
            margin: 0;
            margin-right: 24px;
            word-wrap: break-word;
            white-space: pre-wrap;
            overflow-wrap: break-word;
            font-weight: 500;
            letter-spacing: 0.2px;
        }

        .smarttab-close-btn {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 28px;
            height: 28px;
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #a0aec0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            transition: all 0.2s ease-out;
        }

        .smarttab-close-btn:hover {
            color: #2d3748;
            background-color: rgba(226, 232, 240, 0.5);
        }

        .smarttab-close-btn:active {
            transform: scale(0.95);
        }

        @keyframes smarttab-slideIn {
            from {
                opacity: 0;
                transform: translateX(20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @media (prefers-color-scheme: dark) {
            .smarttab-sticky-note {
                background: linear-gradient(135deg, rgba(45, 55, 72, 0.98), rgba(26, 32, 44, 0.98));
                border-color: rgba(74, 85, 104, 0.8);
                color: #f7fafc;
            }

            .smarttab-note-text {
                color: #e2e8f0;
            }

            .smarttab-close-btn {
                color: #cbd5e0;
            }

            .smarttab-close-btn:hover {
                color: #f7fafc;
                background-color: rgba(74, 85, 104, 0.5);
            }
        }

        @media (max-width: 480px) {
            .smarttab-sticky-note {
                top: 10px;
                right: 10px;
                left: 10px;
                max-width: none;
                width: auto;
            }
        }

        .smarttab-sticky-note * {
            box-sizing: border-box;
        }
    `;
    
    document.head.appendChild(styles);
}

// ============================================
// Remove Existing Sticky Note
// ============================================

function removeExistingStickyNote() {
    const existingNote = document.getElementById(STICKY_NOTE_ID);
    if (existingNote) {
        existingNote.classList.add('smarttab-closing');
        setTimeout(() => {
            if (existingNote.parentNode) {
                existingNote.remove();
            }
        }, 300);
    }
}

// ============================================
// Should Skip Sticky Note
// ============================================

function shouldSkipStickyNote() {
    const hostname = window.location.hostname;
    
    const skipList = ['chrome://', 'about:', 'moz-extension://', 'chrome-extension://'];
    
    for (const skip of skipList) {
        if (hostname.includes(skip)) {
            return true;
        }
    }
    
    if (document.body === null) {
        return true;
    }
    
    return false;
}

// ============================================
// Listen for Popup Messages
// ============================================

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'noteUpdated') {
        if (request.noteContent === '' || !request.noteContent) {
            removeExistingStickyNote();
        } else {
            removeExistingStickyNote();
            setTimeout(() => {
                displayStickyNote(request.noteContent, sender.tab.id);
            }, 100);
        }
        sendResponse({ status: 'ok' });
    }
});

// ============================================
// Handle Window Resize
// ============================================

window.addEventListener('resize', () => {
    const stickyNote = document.getElementById(STICKY_NOTE_ID);
    if (stickyNote) {
        const rect = stickyNote.getBoundingClientRect();
        const maxX = window.innerWidth - stickyNote.offsetWidth - 10;
        const maxY = window.innerHeight - stickyNote.offsetHeight - 10;
        
        if (rect.left > maxX) {
            stickyNote.style.left = maxX + 'px';
        }
        if (rect.top > maxY) {
            stickyNote.style.top = maxY + 'px';
        }
    }
});

// ============================================
// Error Handling
// ============================================

window.addEventListener('error', (event) => {
    console.error('SmartTab content script error:', event.error);
});
