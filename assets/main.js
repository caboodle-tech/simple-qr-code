import { QRCode } from '../dist/qr-code.esm.js';

// Fallback to window.QRCode if import fails (for non-module contexts)
const QRCodeInstance = QRCode || window.QRCode;

// Default values
const DEFAULT_VALUES = {
    url: 'https://github.com/caboodle-tech/simple-qr-code',
    size: 300,
    margin: 4,
    moduleColor: '#1c7d43',
    positionRingColor: '#13532d',
    positionCenterColor: '#70c559',
    backgroundColor: '#ffffff',
    positionMarkerRadius: 10,
    dataMarkerRadius: 10
};

// Get form elements
const form = document.getElementById('qr-form');
const urlInput = document.getElementById('url-input');
const sizeInput = document.getElementById('size-input');
const marginInput = document.getElementById('margin-input');
const moduleColorInput = document.getElementById('module-color');
const positionRingColorInput = document.getElementById('position-ring-color');
const positionCenterColorInput = document.getElementById('position-center-color');
const backgroundColorInput = document.getElementById('background-color');
const positionMarkerRadiusInput = document.getElementById('position-marker-radius');
const dataMarkerRadiusInput = document.getElementById('data-marker-radius');
const positionRadiusValue = document.getElementById('position-radius-value');
const dataRadiusValue = document.getElementById('data-radius-value');
const qrPreview = document.getElementById('qr-preview');
const resetBtn = document.getElementById('reset-btn');
const downloadSvgBtn = document.getElementById('download-svg-btn');
const downloadPngBtn = document.getElementById('download-png-btn');
const blackoutBtn = document.getElementById('blackout-btn');
const whiteoutBtn = document.getElementById('whiteout-btn');

// Generate QR code
const generateQRCode = () => {
    const options = {
        size: parseInt(sizeInput.value, 10),
        margin: parseInt(marginInput.value, 10),
        moduleColor: moduleColorInput.value,
        positionRingColor: positionRingColorInput.value,
        positionCenterColor: positionCenterColorInput.value,
        backgroundColor: backgroundColorInput.value,
        positionMarkerRadius: parseInt(positionMarkerRadiusInput.value, 10),
        dataMarkerRadius: parseInt(dataMarkerRadiusInput.value, 10)
    };

    const url = urlInput.value.trim();

    if (!url) {
        qrPreview.innerHTML = '<p style="color: #ef4444; text-align: center;">Please enter data to encode</p>';
        return;
    }

    try {
        const svg = QRCodeInstance.generate(url, options);
        qrPreview.innerHTML = '';
        qrPreview.appendChild(svg);
    } catch (error) {
        console.error('Error generating QR code:', error);
        qrPreview.innerHTML = `<p style="color: #ef4444; text-align: center;">Error: ${error.message}</p>`;
    }
};

// Update range value displays
const updateRangeDisplays = () => {
    positionRadiusValue.textContent = `${positionMarkerRadiusInput.value}%`;
    dataRadiusValue.textContent = `${dataMarkerRadiusInput.value}%`;
};

// Reset to defaults
const resetToDefaults = () => {
    urlInput.value = DEFAULT_VALUES.url;
    sizeInput.value = DEFAULT_VALUES.size;
    marginInput.value = DEFAULT_VALUES.margin;
    moduleColorInput.value = DEFAULT_VALUES.moduleColor;
    positionRingColorInput.value = DEFAULT_VALUES.positionRingColor;
    positionCenterColorInput.value = DEFAULT_VALUES.positionCenterColor;
    backgroundColorInput.value = DEFAULT_VALUES.backgroundColor;
    positionMarkerRadiusInput.value = DEFAULT_VALUES.positionMarkerRadius;
    dataMarkerRadiusInput.value = DEFAULT_VALUES.dataMarkerRadius;
    updateRangeDisplays();
    generateQRCode();
};

// Download SVG
const downloadSVG = () => {
    const svgElement = qrPreview.querySelector('svg');
    if (!svgElement) {
        alert('Please generate a QR code first');
        return;
    }

    // Clone the SVG to avoid modifying the original
    const svgClone = svgElement.cloneNode(true);

    // Set namespace and attributes
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Convert to string
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create download link
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = 'qr-code.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    // Clean up
    URL.revokeObjectURL(svgUrl);
};

// Download PNG
const downloadPNG = () => {
    const svgElement = qrPreview.querySelector('svg');
    if (!svgElement) {
        alert('Please generate a QR code first');
        return;
    }

    // Clone the SVG to avoid modifying the original
    const svgClone = svgElement.cloneNode(true);
    svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    // Get SVG dimensions
    const svgData = new XMLSerializer().serializeToString(svgClone);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Create image to convert SVG to canvas
    const img = new Image();
    img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Set canvas size to match SVG
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0);

        // Convert to PNG and download
        canvas.toBlob((blob) => {
            const pngUrl = URL.createObjectURL(blob);
            const downloadLink = document.createElement('a');
            downloadLink.href = pngUrl;
            downloadLink.download = 'qr-code.png';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);

            // Clean up
            URL.revokeObjectURL(svgUrl);
            URL.revokeObjectURL(pngUrl);
        }, 'image/png');
    };

    img.onerror = () => {
        alert('Error converting SVG to PNG');
        URL.revokeObjectURL(svgUrl);
    };

    img.src = svgUrl;
};

// Blackout mode (black on white)
const setBlackoutMode = () => {
    moduleColorInput.value = '#000000';
    positionRingColorInput.value = '#000000';
    positionCenterColorInput.value = '#000000';
    backgroundColorInput.value = '#ffffff';
    generateQRCode();
};

// Whiteout mode (white on black)
const setWhiteoutMode = () => {
    moduleColorInput.value = '#ffffff';
    positionRingColorInput.value = '#ffffff';
    positionCenterColorInput.value = '#ffffff';
    backgroundColorInput.value = '#000000';
    generateQRCode();
};

// Event listeners
form.addEventListener('input', generateQRCode);
form.addEventListener('change', generateQRCode);

positionMarkerRadiusInput.addEventListener('input', () => {
    updateRangeDisplays();
    generateQRCode();
});

dataMarkerRadiusInput.addEventListener('input', () => {
    updateRangeDisplays();
    generateQRCode();
});

resetBtn.addEventListener('click', resetToDefaults);
downloadSvgBtn.addEventListener('click', downloadSVG);
downloadPngBtn.addEventListener('click', downloadPNG);
blackoutBtn.addEventListener('click', setBlackoutMode);
whiteoutBtn.addEventListener('click', setWhiteoutMode);

// Initialize
updateRangeDisplays();
generateQRCode();
