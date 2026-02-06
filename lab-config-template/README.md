# Lab Config Floating Button - MkDocs Template

A plug-and-play JavaScript solution for MkDocs lab guides that lets users enter their unique session/pod values once and have placeholders automatically replaced throughout the guide.

## Features

- **Floating button** (⚙️) appears on all pages for quick access
- **Modal popup** for entering values from any page
- **Embedded form** option for specific pages (like introduction)
- **Persistent storage** - values saved in localStorage survive page refreshes
- **Live preview** shows users what their final values will look like
- **Loading indicator** prevents flash of unreplaced placeholders
- **Print-friendly** - button/modal hidden when printing

## Quick Setup

### 1. Copy the JavaScript file

Copy `labConfig.js` to your MkDocs project:
```
docs/
  template_assets/
    js/
      labConfig.js    <-- put it here (or wherever you prefer)
```

### 2. Add to mkdocs.yml

```yaml
extra_javascript:
  - template_assets/js/labConfig.js
```

### 3. (Optional) Embed form on a page

Add this div anywhere you want the full configuration form to appear:

```html
<div id="lab-config-container"></div>
```

The floating button appears automatically on all pages - no extra markup needed.

## Customizing Placeholders

Edit the `PLACEHOLDERS` object at the top of `labConfig.js`:

```javascript
const PLACEHOLDERS = {
    // Format: 'INPUT_NAME': { pattern: /regex/g, prefix: 'before', suffix: 'after' }
    
    'XXX': { pattern: /cbXXX/g, prefix: 'cb', suffix: '' },
    // User enters: 123
    // Replaces: cbXXX → cb123
    
    'YY': { pattern: /dc-YY\.com/g, prefix: 'dc-', suffix: '.com' },
    // User enters: 01  
    // Replaces: dc-YY.com → dc-01.com
    
    'ZZZZ': { pattern: /dCloudZZZZ!/g, prefix: 'dCloud', suffix: '!' }
    // User enters: 1234
    // Replaces: dCloudZZZZ! → dCloud1234!
};
```

### Example: Simple placeholders

If your guide just uses `{{POD}}` and `{{PASSWORD}}`:

```javascript
const PLACEHOLDERS = {
    'POD': { pattern: /\{\{POD\}\}/g, prefix: '', suffix: '' },
    'PASSWORD': { pattern: /\{\{PASSWORD\}\}/g, prefix: '', suffix: '' }
};
```

### What to update when changing placeholders:

1. **PLACEHOLDERS object** (line ~14) - the replacement logic
2. **loadValues()** (line ~26) - default empty values
3. **hasConfiguredValues()** (line ~37) - check which values exist
4. **initConfigForm()** (line ~219) - the embedded form HTML
5. **createFloatingButton()** (line ~700) - the modal form HTML

Search for `XXX`, `YY`, and `ZZZZ` in the file to find all places to update.

## How It Works

1. User clicks the floating button (or uses embedded form)
2. Enters their unique values (pod number, datacenter, etc.)
3. Values are saved to `localStorage`
4. Page reloads and applies replacements to all text content
5. Scroll position is preserved

## File Structure

```
your-mkdocs-project/
├── docs/
│   ├── template_assets/
│   │   └── js/
│   │       └── labConfig.js
│   ├── introduction.md      <-- can add <div id="lab-config-container"></div>
│   └── ... other docs
└── mkdocs.yml               <-- add extra_javascript entry
```

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
Requires localStorage support.

## License

Free to use and modify for your lab guides.
