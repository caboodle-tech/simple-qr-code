import fs from 'node:fs';
import { defineConfig } from 'rolldown';

const year = new Date().getFullYear();
const info = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }));
const { version } = info;

const licenseHeader = `/*! @license
 * Simple QR Code v${version} Copyright (c) ${year} Caboodle Tech Inc.
 * License and source code available at: https://github.com/caboodle-tech/simple-qr-code
 */`;

/**
 * Simple plugin to strip comments while preserving URLs and special comments (/**! or //!)
 */
const stripComments = () => {
    return {
        name: 'strip-comments',
        renderChunk(code) {
            let result = code;

            /**
             * Remove single-line comments (// ...) but preserve URLs and //! comments
             * Check if // is immediately after : (which means it's a URL)
             * Or if it starts with //! (which should be preserved)
             */
            result = result.replace(/\/\/[^\r\n]*/g, (match, offset, string) => {
                // Preserve URLs (// after :)
                if (offset > 0 && string[offset - 1] === ':') {
                    return match;
                }
                // Preserve //! comments
                if (match.startsWith('//!')) {
                    return match;
                }
                return '';
            });

            /**
             * Remove multi-line comments but preserve /*!, /**!, and @license comments
             */
            result = result.replace(/\/\*[\s\S]*?\*\//g, (match) => {
                // Preserve /*! comments (single asterisk with !)
                if (match.startsWith('/*!')) {
                    return match;
                }
                // Preserve /**! comments (double asterisk with !)
                if (match.startsWith('/**!')) {
                    return match;
                }
                // Preserve comments containing @license (for minifier compatibility)
                if (match.includes('@license') || match.includes('@preserve') || match.includes('@copyright')) {
                    return match;
                }
                return '';
            });

            /**
             * Clean up: remove empty lines that appear immediately after comment blocks
             * This handles cases where comment end is followed by multiple newlines
             */
            result = result.replace(/\*\/\n\n+/g, '*/\n');

            /**
             * Clean up: remove completely empty lines
             */
            result = result.replace(/^\s+$/gm, '');

            /**
             * Clean up excessive blank lines (more than 2 consecutive)
             */
            result = result.replace(/\n{3,}/g, '\n\n');

            return { code: result };
        }
    };
};

/**
 * Plugin to unwrap single named export in IIFE format
 * Changes `return exports;` to `return exports.QRCode;` so the global variable
 * directly references the instance instead of the exports object
 */
const unwrapIIFEExport = () => {
    return {
        name: 'unwrap-iife-export',
        renderChunk(code) {
            // Replace `return exports;` with `return exports.QRCode;` for IIFE builds
            // This makes the global QRCode variable directly reference the instance
            const result = code.replace(/return\s+exports\s*;/g, 'return exports.QRCode;');
            return { code: result };
        }
    };
};

export default defineConfig([
    {
        input: 'qr-code.js',
        output: {
            file: 'dist/qr-code.esm.js',
            format: 'esm',
            banner: licenseHeader,
            minify: false
        },
        plugins: [stripComments()]
    },
    {
        input: 'qr-code.js',
        output: {
            file: 'dist/qr-code.iife.js',
            format: 'iife',
            name: 'QRCode',
            banner: licenseHeader,
            minify: false
        },
        plugins: [stripComments(), unwrapIIFEExport()]
    },
    {
        input: 'qr-code.js',
        output: {
            file: 'dist/qr-code.esm.min.js',
            format: 'esm',
            banner: licenseHeader,
            legalComments: 'inline',
            minify: true
        }
    },
    {
        input: 'qr-code.js',
        output: {
            file: 'dist/qr-code.iife.min.js',
            format: 'iife',
            name: 'QRCode',
            banner: licenseHeader,
            legalComments: 'inline',
            keepNames: true,
            minify: {
                mangle: false
            }
        },
        plugins: [unwrapIIFEExport()]
    }
]);
