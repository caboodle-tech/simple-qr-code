import fs from 'node:fs';
import { defineConfig } from 'rolldown';

const year = new Date().getFullYear();
const info = JSON.parse(fs.readFileSync('package.json', { encoding: 'utf8' }));
const { version } = info;

const licenseHeader = `/**
 * Simple QR Code v${version} Copyright (c) ${year} Caboodle Tech Inc.
 * License and source code available at: https://github.com/caboodle-tech/simple-qr-code
 */`;

/**
 * Simple plugin to strip comments while preserving URLs and banner
 */
const stripComments = () => {
    return {
        name: 'strip-comments',
        renderChunk(code) {
            /**
             * Find and preserve banner before removing comments
             */
            const bannerPattern = /\/\*\*[\s\S]*?Copyright \(c\)[\s\S]*?\*\/\s*\n?/;
            const bannerMatch = code.match(bannerPattern);
            const preservedBanner = bannerMatch ? bannerMatch[0] : '';

            let result = code;

            /**
             * Remove single-line comments (// ...) but preserve URLs
             * Check if // is immediately after : (which means it's a URL)
             */
            result = result.replace(/\/\/[^\r\n]*/g, (match, offset, string) => {
                if (offset > 0 && string[offset - 1] === ':') {
                    return match;
                }
                return '';
            });

            /**
             * Remove ALL multi-line comments
             */
            result = result.replace(/\/\*[\s\S]*?\*\//g, '');

            /**
             * Add banner back at the start if it existed
             */
            if (preservedBanner) {
                result = `${preservedBanner}\n${result}`;
            }

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
            banner: licenseHeader,
            minify: false
        },
        plugins: [stripComments()]
    },
    {
        input: 'qr-code.js',
        output: {
            file: 'dist/qr-code.esm.min.js',
            format: 'esm',
            banner: licenseHeader,
            minify: true
        },
        plugins: [stripComments()]
    },
    {
        input: 'qr-code.js',
        output: {
            file: 'dist/qr-code.iife.min.js',
            format: 'iife',
            banner: licenseHeader,
            minify: true
        },
        plugins: [stripComments()]
    }
]);
