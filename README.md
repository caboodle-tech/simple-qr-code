# Simple QR Code

A modern, self-contained QR code generator with **no dependencies**. Complete QR code generation algorithm included. Perfect for projects that need a lightweight, zero-dependency solution.

## Features

- ✅ **Zero Dependencies** - Complete QR code algorithm included
- ✅ **ESM Module** - Modern JavaScript module support
- ✅ **SVG Output** - Returns native SVG elements for easy styling
- ✅ **Customizable** - Colors, sizes, margins, and rounded corners
- ✅ **Small Bundle** - Lightweight and fast
- ✅ **Browser & Node.js** - Works in both environments

## Installation

Download the appropriate JavaScript file from the [dist repository](https://github.com/caboodle-tech/simple-qr-code/tree/main/dist):

- **`qr-code.js`** - Full source with comments (development, ESM export)
- **`dist/qr-code.esm.js`** - ESM format, comments removed
- **`dist/qr-code.iife.js`** - IIFE format for browser globals, comments removed
- **`dist/qr-code.esm.min.js`** - ESM format, minified
- **`dist/qr-code.iife.min.js`** - IIFE format, minified

**Adding to Your Project:** Once downloaded, add the JavaScript file to your project directory. You can include it via a script tag in HTML, import it as an ES module, or bundle it with your build tools. The file is self-contained and ready to use.

## Usage

### ESM Import

```javascript
import { QRCode } from './qr-code.js';

// Generate a simple QR code
const svg = QRCode.generate('https://example.com');
document.body.appendChild(svg);

// With customization options
const svg = QRCode.generate('https://example.com', {
    size: 300,
    margin: 4,
    moduleColor: '#1c7d43',
    positionRingColor: '#13532d',
    positionCenterColor: '#70c559',
    backgroundColor: '#ffffff',
    positionMarkerRadius: 10,
    dataMarkerRadius: 10
});
document.body.appendChild(svg);
```

### Browser Global (Script Tag)

```html
<script src="dist/qr-code.iife.js"></script>
<script>
    const svg = QRCode.generate('https://example.com');
    document.body.appendChild(svg);
</script>
```

## API Reference

### `QRCode.generate(url, options)`

Generates a QR code as an SVG element.

#### Parameters

- **url** (string, required) - The data to encode in the QR code (URL, text, etc.)

- **options** (object, optional) - Configuration options:
  - `size` (number, default: `180`) - SVG width and height in pixels
  - `margin` (number, default: `4`) - Margin size in modules
  - `moduleColor` (string, default: `'#000000'`) - Color for data modules
  - `positionRingColor` (string, default: `'#000000'`) - Color for finder pattern outer ring
  - `positionCenterColor` (string, default: `'#000000'`) - Color for finder pattern center
  - `backgroundColor` (string, default: `'#ffffff'`) - Background color
  - `positionMarkerRadius` (number, default: `0`) - Corner radius for finder patterns (0-100)
  - `dataMarkerRadius` (number, default: `0`) - Corner radius for data modules (0-100)

#### Returns

**SVGElement** - A native SVG element containing the QR code

## Examples

### Basic Usage

```javascript
// Using browser global (default)
const qrCode = QRCode.generate('Hello, World!');
document.getElementById('container').appendChild(qrCode);
```

### Custom Styling

```javascript
// Using browser global (default)
const qrCode = QRCode.generate('https://example.com', {
    size: 400,                      // SVG width and height in pixels
    margin: 2,                      // Margin size in modules
    moduleColor: '#2563eb',         // Color for data modules
    positionRingColor: '#1e40af',   // Color for finder pattern outer ring
    positionCenterColor: '#3b82f6', // Color for finder pattern center
    backgroundColor: '#f0f0f0',     // Background color
    positionMarkerRadius: 50,       // Corner radius for finder patterns (0-100)
    dataMarkerRadius: 25            // Corner radius for data modules (0-100)
});

// The SVG can be styled further with inline-CSS
qrCode.style.border = '2px solid #ccc';
qrCode.style.borderRadius = '8px';

document.body.appendChild(qrCode);

/*
 * The preferred way to style the QR code is with CSS custom properties in a CSS file:
 *
 * .qr-code {
 *     --module-color: #2563eb;
 *     --position-ring-color: #1e40af;
 *     --position-center-color: #3b82f6;
 *     --background-color: #f0f0f0;
 * }
 */
```

### Dynamic QR Code Generation

```html
<!DOCTYPE html>
<html>
<head>
    <title>QR Code Generator</title>
    <script src="qr-code.js"></script>
</head>
<body>
    <div id="qr-container"></div>
    <script>
        // Generate QR code when page loads
        const container = document.getElementById('qr-container');
        const qrCode = QRCode.generate('https://example.com', {
            size: 300,
            margin: 4,
            moduleColor: '#1c7d43',
            positionRingColor: '#13532d',
            positionCenterColor: '#70c559',
            backgroundColor: '#ffffff',
            positionMarkerRadius: 10,
            dataMarkerRadius: 10
        });
        container.appendChild(qrCode);
    </script>
</body>
</html>
```

### Download as File

You can make the generated QR code available for download as SVG or PNG by adding simple JavaScript to your project:

```javascript
// Using browser global (default)
const svg = QRCode.generate('https://example.com');

// Download as SVG
const svgData = new XMLSerializer().serializeToString(svg);
const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
const svgUrl = URL.createObjectURL(svgBlob);
const link = document.createElement('a');
link.href = svgUrl;
link.download = 'qr-code.svg';
link.click();

// Download as PNG (requires canvas conversion)
const img = new Image();
img.onload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qr-code.png';
        link.click();
    }, 'image/png');
};
img.src = URL.createObjectURL(svgBlob);
```

## Styling

The generated SVG elements can be styled using CSS. All color options can be customized:

```css
/* Target the SVG itself */
.qr-code {
    border: 1px solid #ccc;
    border-radius: 8px;
}

/* Customize all color options via CSS custom properties */
.qr-code {
    --module-color: #2563eb;              /* Color for data modules */
    --position-ring-color: #1e40af;       /* Color for finder pattern outer ring */
    --position-center-color: #3b82f6;     /* Color for finder pattern center */
    --background-color: #ffffff;          /* Background color */
}

/* Size and spacing can also be controlled */
.qr-code {
    width: 400px;
    height: 400px;
    margin: 20px;
    padding: 10px;
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Any browser with ES6+ support

## History & Philosophy

This project was inspired by [xsorifc28/qr-code](https://github.com/xsorifc28/qr-code), a fork of [bitjson/qr-code](https://github.com/bitjson/qr-code). While those projects are excellent, they required **625 packages and dependencies**! Most dependencies were only needed for building/bundling, not the actual QR code generation.

At Caboodle Tech, we believe in using native code and avoiding unnecessary dependencies. This library contains the complete QR code algorithm with **zero dependencies** in a single JavaScript file. The only optional build step is minification to your liking. No bundler, no framework, just download and use it.

## License

Common Clause with MIT - See [LICENSE.txt](LICENSE.txt) for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

**Christopher Keers** - [Caboodle Tech](https://github.com/caboodle-tech)

## Links

- [GitHub Repository](https://github.com/caboodle-tech/simple-qr-code)
- [Report Issues](https://github.com/caboodle-tech/simple-qr-code/issues)
