# SmartTab Toolkit - Quick Setup Guide

## ⚡ Quick Start (5 minutes)

### Step 1: Prepare the Icon
You need a 128x128 PNG file. **Quick option:**

Open this in a terminal in the project folder:
```bash
# If you have ImageMagick installed:
magick convert icons/icon.svg -size 128x128 icons/icon.png

# Or manually:
# 1. Go to: https://convertio.co/svg-png/
# 2. Upload: icons/icon.svg
# 3. Set size: 128x128
# 4. Download as: icons/icon.png
```

### Step 2: Load Extension
```
1. Open: chrome://extensions/
2. Toggle: "Developer mode" (top right)
3. Click: "Load unpacked"
4. Select: smart-tab-toolkit folder
5. Done! ✓
```

### Step 3: Test It
```
1. Click SmartTab icon in toolbar
2. Type a note
3. Click Save
4. Visit any website
5. See sticky note appear!
```

---

## 📁 Files Included

| File | Purpose |
|------|---------|
| `manifest.json` | Extension configuration |
| `popup.html` | Note editor UI |
| `popup.css` | Modern styling |
| `popup.js` | Save/load logic |
| `content.js` | Sticky note on page |
| `background.js` | Background tasks |
| `icons/icon.svg` | Icon source (needs PNG conversion) |
| `README.md` | Full documentation |

---

## 🎨 Customization

### Change Colors
Edit `popup.css`, find `:root` section:
```css
--primary-color: #5e72e4;  /* Change this to your color */
--secondary-color: #f7f9fc;
```

### Change Popup Size
Edit `popup.css`:
```css
body {
    width: 380px;  /* Change width */
    min-height: 500px;  /* Change height */
}
```

### Modify Permissions
Edit `manifest.json`:
```json
"permissions": [
    "tabs",
    "storage",
    "activeTab"
]
```

---

## ✨ Features Checklist

- ✅ Save notes per tab
- ✅ Sticky notes on page
- ✅ Auto-save with confirmation
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Accessibility (ARIA, keyboard nav)
- ✅ 100% local storage (no cloud)
- ✅ Modern animations
- ✅ Character counter
- ✅ Clear button
- ✅ Auto-resize textarea
- ✅ Keyboard shortcut (Ctrl+S)
- ✅ Error handling
- ✅ Privacy-first design

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Icon not showing | Convert SVG to PNG (128x128) |
| Notes not saving | Check Extensions page - verify it's enabled |
| Sticky note not appearing | Refresh the page, try different site |
| Popup won't open | Reload extension (⟲ button on extensions page) |

---

## 📊 File Sizes

```
popup.html        ~2.5 KB
popup.css         ~8.2 KB
popup.js          ~5.8 KB
content.js        ~7.5 KB
background.js     ~2.1 KB
manifest.json     ~0.8 KB
icon.svg          ~1.2 KB
icon.png          ~8-12 KB (after conversion)
─────────────────────
Total:            ~36-40 KB
```

---

## 🚀 Next Steps

After installation:

1. **Test on different sites** - Ensure sticky notes work everywhere
2. **Try keyboard shortcut** - Ctrl+S to save
3. **Test dark mode** - If enabled on your system
4. **Read README.md** - For full feature documentation
5. **Customize colors** - Make it your own!

---

## 💾 Storage Location

Your notes are stored in Chrome's local storage:
```
chrome://extensions/
→ Click "SmartTab Toolkit"
→ "Inspect views: service worker"
→ Console: chrome.storage.local.get(null, console.log)
```

---

## 🔐 Privacy Verified

✅ No external requests  
✅ No analytics tracking  
✅ No cloud sync (unless you add it)  
✅ No permissions abuse  
✅ All data local on your machine  

---

## 📞 Need Help?

1. Check README.md for detailed docs
2. Look at code comments (lots of them!)
3. Enable Developer Mode and check console (F12)
4. Test on different websites

---

**Ready? Let's go! 🚀**

*SmartTab Toolkit - Remember why you opened that tab!*
