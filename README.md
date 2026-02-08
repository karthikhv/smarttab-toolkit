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

## 🎨 UI Features

### Modern Design
- **Color Palette**: Professional blues and grays with smooth gradients
- **Typography**: System fonts for fast loading and native feel
- **Spacing**: Consistent 4px grid for balanced layout
- **Shadows**: Subtle depth with CSS shadows

### Accessibility
- ♿ Full keyboard navigation
- 🎯 Focus indicators on all interactive elements
- 🔊 ARIA labels for screen readers
- 📱 Works at any window size

### Dark Mode
- Automatically adapts to system preference
- Readable in any lighting condition
- Smooth transitions between modes

### Animations
- ✨ Slide-in on popup open
- 🎪 Smooth transitions on hover
- 🎬 Sticky note appears with animation
- 📊 Auto-resizing textarea

## 🔒 Privacy & Security

### Data Storage
- ✅ **100% Local**: All notes stored in `chrome.storage.local`
- ❌ **No Cloud Sync**: No external servers
- ❌ **No Tracking**: No analytics or telemetry
- ❌ **No Permissions Abuse**: Only uses required permissions

### Permissions Used
- `tabs`: Get current tab information (read-only)
- `storage`: Save/load notes locally
- `activeTab`: Know which tab you're viewing

## 🛠️ Technical Details

### Manifest V3 Compliance
- Uses service workers instead of persistent background pages
- Content scripts injected safely with proper CSP compliance
- No eval or inline scripts

### Browser API Usage
- `chrome.tabs.query()`: Get current tab
- `chrome.storage.local`: Persist notes
- `chrome.runtime.onMessage`: Message passing
- `chrome.tabs.sendMessage()`: Content script communication

### Performance
- Minimal memory footprint (~2-3 MB)
- No jQuery or heavy dependencies
- Pure vanilla JavaScript
- Lazy loading of content scripts

## 📝 Storage Schema

Notes are stored with the following structure:
```javascript
{
  "note_<tabId>": "Your note content here...",
  "note_<tabId>_timestamp": "2026-02-08T10:30:00.000Z"
}
```

Example:
```javascript
{
  "note_123456789": "Follow up on project proposal",
  "note_123456789_timestamp": "2026-02-08T10:30:00.000Z"
}
```

## 🚀 Future Enhancements

Potential features for v2.0+:
- 📚 **Note Categories**: Organize by type
- 🔍 **Search**: Find notes across all tabs
- 📊 **Statistics**: Track tab habits
- 🏷️ **Tags & Labels**: Better organization
- ☁️ **Cloud Sync**: Optional sync across devices
- 🔔 **Reminders**: Set reminders for important notes
- 📤 **Export**: Export notes as JSON/CSV
- 🎯 **Templates**: Preset note templates
- 🤖 **AI Summary**: Auto-summarize long notes

## 🐛 Troubleshooting

### Notes not appearing on the page?
- Ensure content script is enabled in extensions page
- Refresh the page (F5)
- Try a different website to isolate issue
- Check browser console for errors (F12)

### Sticky note looks broken?
- Try disabling other extensions that modify page CSS
- Test on a fresh tab
- Clear browser cache (Ctrl+Shift+Delete)

### Extension not working?
- Verify it's enabled at `chrome://extensions/`
- Try reloading the extension (refresh icon next to name)
- Check Developer Mode is enabled
- Look for error messages in the Extensions Developer mode

## 📄 License

This extension is free to use and modify for personal use.

## 💡 Tips & Tricks

### Keyboard Shortcuts
- `Ctrl+S` (or `Cmd+S` on Mac): Save note from popup
- `Tab`: Insert tab character in textarea
- `Tab` with focus on buttons: Navigate UI

### Best Practices
- Keep notes concise and actionable
- Use notes as reminders, not as documentation
- Regularly review and clean up old tabs
- One note per tab = maximum clarity

### Performance Tips
- Close unused tabs to free up memory
- Sticky notes disappear when you close popup
- Notes persist even after browser restart
- Storage limit: ~10MB per extension (plenty for thousands of notes!)

## 🤝 Contributing

Found a bug or have a feature idea? 
- Check the troubleshooting section first
- Test on multiple websites
- Note the steps to reproduce

## 📞 Support

For issues or questions:
1. Check this README
2. Look at the code comments (well-documented!)
3. Review browser console for error messages (F12)
4. Test with sample tabs before reporting issues

---

**Made with ❤️ for productivity lovers who open too many tabs!**

*Last Updated: February 8, 2026*
