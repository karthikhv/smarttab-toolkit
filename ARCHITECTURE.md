# SmartTab Toolkit - Visual Architecture & Diagrams

## 🏗️ Extension Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CHROME BROWSER                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         SMARTTAB EXTENSION COMPONENTS              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────┐   │
│  │  Manifest   │  │   Popup UI   │  │  Background    │   │
│  │   V3        │  │              │  │  Service       │   │
│  │             │  │ • popup.html │  │  Worker        │   │
│  │ • Perms     │  │ • popup.css  │  │                │   │
│  │ • Scripts   │  │ • popup.js   │  │ • background   │   │
│  │ • Icon      │  │              │  │   .js          │   │
│  └─────────────┘  └──────────────┘  └────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │        CONTENT SCRIPT (Injected on pages)           │  │
│  │                                                        │  │
│  │  • Displays sticky notes on webpage                 │  │
│  │  • Listens for popup updates                        │  │
│  │  • Manages sticky note animations                   │  │
│  │                                                        │  │
│  │    content.js                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

### Saving a Note:
```
User clicks icon
    ↓
Popup loads (popup.html)
    ↓
popup.js gets current tab ID
    ↓
popup.js loads existing note from storage
    ↓
User types note
    ↓
User clicks "Save"
    ↓
popup.js validates & saves to chrome.storage.local
    ↓
Confirmation: "Saved! ✓"
    ↓
popup.js sends message to content.js
    ↓
content.js updates/creates sticky note
    ↓
Sticky note animates onto page
```

### Viewing a Sticky Note:
```
User visits website
    ↓
content.js loads on page
    ↓
content.js checks storage for note_<tabId>
    ↓
Note found in storage?
    ├─→ YES: Create sticky note element
    │        Inject CSS styles
    │        Animate into view ✓
    │
    └─→ NO: Do nothing
         (No sticky note shown)
```

### Clearing a Note:
```
User clicks "Clear" button
    ↓
popup.js removes from chrome.storage.local
    ↓
popup.js sends message to content.js
    ↓
content.js finds sticky note element
    ↓
content.js animates away & removes from DOM
    ↓
Sticky note disappears from page
```

---

## 🎨 UI Component Structure

### Popup Layout:
```
┌─────────────────────────────────────┐
│  SmartTab Toolkit (Header)          │  ← .title
│  www.example.com (Subtitle)         │  ← .subtitle
├─────────────────────────────────────┤
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ Write note here...              │ │  ← .textarea
│  │                                  │ │
│  │                                  │ │
│  └─────────────────────────────────┘ │
│  145/1000                            │  ← .char-count
│                                       │
│  ┌──────────────┐  ┌──────────────┐ │
│  │    Save      │  │    Clear     │ │  ← .btn
│  └──────────────┘  └──────────────┘ │
│                                       │
│  Saved! ✓                            │  ← .feedback
│                                       │
├─────────────────────────────────────┤
│  Notes stored locally. No tracking. │  ← .footer
└─────────────────────────────────────┘
```

### Sticky Note Layout:
```
      ┌──────────────────────────────┐
      │ My note content here...      │ ×  ← Close button
      │ This is why I opened this    │
      │ tab.                          │
      └──────────────────────────────┘
      (appears in top-right corner)
```

---

## 🔄 Message Flow

### From Popup to Content Script:
```
popup.js
    │
    │ chrome.tabs.sendMessage({
    │   action: 'noteUpdated',
    │   noteContent: 'Your note here'
    │ })
    ↓
content.js listener
    │
    ├─→ Action is 'noteUpdated'?
    │   ├─→ YES: Update sticky note
    │   └─→ NO: Ignore
    ↓
Browser confirms message received
```

### Between Tabs (via background.js):
```
content.js
    │
    │ chrome.runtime.sendMessage({
    │   action: 'getTabId'
    │ })
    ↓
background.js
    │
    │ chrome.runtime.onMessage listener
    │ Extracts sender.tab.id
    │ sendResponse({ tabId: 12345 })
    ↓
content.js receives tab ID
    │
    └─→ Uses tab ID for storage keys
```

---

## 💾 Storage Structure

```
chrome.storage.local
│
├─ note_123456789 (Tab ID 1)
│  └─ "Review Q1 budget proposal"
│
├─ note_123456789_timestamp
│  └─ "2026-02-08T10:30:00.000Z"
│
├─ note_234567890 (Tab ID 2)
│  └─ "Check camera settings"
│
├─ note_234567890_timestamp
│  └─ "2026-02-08T11:15:00.000Z"
│
└─ ... more notes ...

Total: ~10MB available per extension
```

---

## 🎭 State Management

### Popup States:
```
┌──────────────┐
│   LOADING    │ (Initial state)
│              │
│ ↓            ↓
│ ERROR    SUCCESS
│ │
│ └─→ ┌───────────┐
│     │  EDITING  │ (User typing)
│     └───────────┘
│          ↓
│     ┌─────────────┐
│     │   SAVING    │ (Ctrl+S or click Save)
│     └─────────────┘
│          ↓
│     ┌──────────────┐
│     │   SAVED ✓    │ (Confirmation visible)
│     └──────────────┘
│          ↓
│     Auto-hide after 2.5s
│          ↓
│     Return to EDITING state
└──────────────┘
```

---

## 🚀 Initialization Sequence

```
1. EXTENSION INSTALLATION
   └─ User loads extension via chrome://extensions/
   
2. MANIFEST PARSED
   └─ Chrome reads manifest.json
   
3. BACKGROUND WORKER STARTED
   └─ background.js initializes
   
4. CONTENT SCRIPTS REGISTERED
   └─ content.js ready to inject
   
5. ICON ADDED TO TOOLBAR
   └─ User sees SmartTab icon
   
6. READY FOR USE ✓
   └─ Extension operational
```

### On Each Page Load:
```
1. Page requests
   └─ Browser navigates to URL
   
2. Page loads
   └─ HTML, CSS, JS download
   
3. DOM ready
   └─ document_end event fires
   
4. content.js injects
   └─ Script runs on page
   
5. Check storage
   └─ Look for note_<tabId>
   
6. Display sticky note?
   ├─ YES → Create & animate in
   └─ NO  → Do nothing
```

---

## 🎨 CSS Architecture

```
popup.css structure:
│
├─ CSS Variables
│  ├─ Colors (primary, secondary, text)
│  ├─ Spacing (xs, sm, md, lg, xl)
│  ├─ Typography (font, sizes, weights)
│  └─ Effects (shadows, transitions)
│
├─ Base Styles
│  ├─ * (reset)
│  ├─ body
│  └─ HTML elements
│
├─ Layout Components
│  ├─ .container
│  ├─ .header
│  ├─ .form
│  └─ .footer
│
├─ Form Elements
│  ├─ .textarea
│  ├─ .btn
│  ├─ .btn-primary
│  └─ .btn-secondary
│
├─ Feedback
│  ├─ .feedback
│  ├─ .feedback-text
│  ├─ .feedback-text.success
│  └─ .feedback-text.error
│
├─ Animations
│  ├─ @keyframes slideDown
│  ├─ @keyframes slideUp
│  ├─ @keyframes fadeIn
│  └─ @keyframes transitions
│
├─ Dark Mode
│  └─ @media (prefers-color-scheme: dark)
│
└─ Responsive
   └─ @media (max-width: 400px)
```

---

## 📈 Event Flow

```
User Events → Listeners → Handlers → State Change → UI Update

click Save
    ↓
noteForm.addEventListener('submit')
    ↓
submitHandler() runs
    ↓
chrome.storage.local.set()
    ↓
Storage updated
    ↓
showFeedback() called
    ↓
"Saved! ✓" appears
    ↓
Auto-hides after 2.5s
```

---

## 🔐 Permission Model

```
Extension Requests → Chrome Prompts User → User Allows → Permission Granted

"tabs" permission
└─ Purpose: Get current tab info
   └─ Risk: Low (read-only)
   └─ Usage: chrome.tabs.query()

"storage" permission
└─ Purpose: Save/load notes
   └─ Risk: Low (local only)
   └─ Usage: chrome.storage.local.get/set

"activeTab" permission
└─ Purpose: Know active tab
   └─ Risk: Low (tab awareness)
   └─ Usage: Popup can know which tab it's on
```

---

## 🌐 Browser Integration

```
Chrome Extension System
│
├─ Extension Host (keeps extension alive)
│  └─ Manages service workers
│
├─ Content Script System (runs on pages)
│  └─ Isolated world, communicates via messages
│
├─ Storage System (chrome.storage.local)
│  └─ Encrypted, persistent storage
│
├─ Message Passing System
│  └─ Enables inter-component communication
│
└─ UI System
   └─ Popup window (separate from page)
```

---

## 💻 File Dependencies Graph

```
manifest.json (Entry point)
    │
    ├─→ popup.html
    │   ├─→ popup.css
    │   └─→ popup.js
    │       ├─ Uses chrome.tabs
    │       ├─ Uses chrome.storage
    │       └─ Sends messages to content.js
    │
    ├─→ content.js
    │   ├─ Uses chrome.storage
    │   ├─ Listens for messages
    │   └─ Injects dynamic CSS
    │
    ├─→ background.js
    │   ├─ Uses chrome.runtime
    │   └─ Routes messages
    │
    └─→ icons/icon.png
        └─ Extension icon (128x128)
```

---

## 🎯 Feature Implementation Map

```
"Why Did I Open This Tab?" Feature
│
├─ Save Note
│  ├─ UI: Textarea + Save button
│  ├─ Logic: popup.js save handler
│  └─ Storage: chrome.storage.local
│
├─ Load Note
│  ├─ UI: Textarea pre-fills
│  ├─ Logic: popup.js on open
│  └─ Retrieval: From storage
│
├─ Display Sticky Note
│  ├─ UI: Fixed position element
│  ├─ Logic: content.js creates DOM
│  └─ Styling: Dynamic CSS injection
│
├─ Close Sticky Note
│  ├─ UI: × button on sticky note
│  ├─ Logic: Remove element
│  └─ State: Note still saved
│
├─ Clear Note
│  ├─ UI: Clear button in popup
│  ├─ Logic: popup.js clear handler
│  └─ Storage: Remove from storage
│
└─ Confirmation
   ├─ UI: "Saved! ✓" message
   ├─ Logic: Show for 2.5 seconds
   └─ Animation: Fade in/out
```

---

## 📱 Responsive Behavior

```
Desktop (380px popup)
├─ Full UI visible
├─ Textarea: 140px height
└─ Buttons: Side by side

Tablet (Sticky note)
├─ Top-right corner
├─ Adjusted for screen
└─ Touch-friendly buttons

Mobile (320px popup)
├─ Adjusted padding
├─ Textarea: 120px height
├─ Sticky note: Full width
└─ Close button: Larger touch target
```

---

## 🔄 Extension Lifecycle

```
Installation
    ↓
manifest.json loaded
    ↓
background.js initialized
    ↓
Extension idle
    ↓
User clicks icon
    ↓
popup.js runs
    ↓
popup.js sleeps (user not clicking)
    ↓
User visits page
    ↓
content.js injects
    ↓
content.js displays sticky note
    ↓
Page closed
    ↓
content.js unloads
    ↓
(cycle continues)
```

---

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Efficient message passing
- ✅ Safe content isolation
- ✅ Minimal performance impact
- ✅ Easy to extend with new features

**Visual diagrams complete!** 🎨
