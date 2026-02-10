# SmartTab Toolkit - Chrome Extension

A modern, privacy-first Chrome extension that helps you remember why you opened each tab. Save quick notes per tab with a beautiful, intuitive UI inspired by Slack and Notion.

## 🎯 Features

### Feature 1: "Why Did I Open This Tab?"
- **Per-Tab Notes**: Save individual notes for each tab
- **Sticky Note Display**: Notes appear as elegant sticky notes on the page
- **Auto-Save**: Persists notes in Chrome's local storage
- **Quick Access**: Open the popup to view/edit your note

### Additional Features
- 🎨 Modern, clean UI with dark mode support
- 🔒 **100% Privacy**: All data stored locally, no external calls
- ⚡ **Fast & Lightweight**: Minimal performance impact
- ♿ **Accessible**: Full keyboard navigation and ARIA labels
- 📱 **Responsive**: Works on any browser window size
- ✨ **Smooth Animations**: Polished transitions and feedback

## 📁 Project Structure

```
smart-tab-toolkit/
├── manifest.json          # Extension configuration (Manifest V3)
├── popup.html            # Popup UI
├── popup.css             # Popup styles (modern design)
├── popup.js              # Popup functionality
├── content.js            # Page content script (sticky notes)
├── background.js         # Service worker (background tasks)
├── icons/
│   └── icon.svg          # Extension icon (convert to PNG)
└── README.md             # This file
```

## 🚀 Installation

### Prerequisites
- Google Chrome/Chromium browser
- Icon file: `icons/icon.png` (128x128 pixels)

### Step 1: Create the Icon
The extension needs a 128x128 PNG icon. Choose one of these options:

**Option A: Using Online Converter**
1. Open https://convertio.co/svg-png/
2. Upload `icons/icon.svg`
3. Set size to 128x128
4. Download and save as `icons/icon.png`

**Option B: Using ImageMagick (CLI)**
```bash
magick convert icons/icon.svg -size 128x128 icons/icon.png
```

**Option C: Using Inkscape**
1. Open `icons/icon.svg` in Inkscape
2. Export as PNG (128x128)
3. Save as `icons/icon.png`

### Step 2: Load the Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `smart-tab-toolkit` folder
5. ✅ Extension is now active!

### Step 3: Verify Installation
- You should see the SmartTab icon in your Chrome toolbar
- Click it to open the popup
- Try saving a note on any tab

## 📖 How to Use

### Saving a Note
1. Click the SmartTab Toolkit icon in the toolbar
2. Write a quick note in the textarea
3. Click **Save** (or press `Ctrl+S`)
4. See the "Saved! ✓" confirmation message
5. Your note is now saved for this specific tab

### Viewing Your Note
- The sticky note automatically appears in the top-right corner of the page
- Readable over most page content
- Click the × button to dismiss (doesn't delete the note)

### Clearing a Note
1. Open the popup for any tab
2. Click **Clear** button
3. The note is removed immediately

### Character Limit
- 1000 characters max per note
- Character counter shows usage
- Warning colors at 750+ and 900+ characters
