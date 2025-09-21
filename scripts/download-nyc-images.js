#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { nycFilmingLocations } from './build-nyc-image-urls.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the comprehensive list of 30 NYC filming locations from the URL builder
const nycImages = nycFilmingLocations;

const downloadImage = (url, filepath) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        const request = https.get(url, response => {
            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve();
            });

            file.on('error', reject);
        });

        request.on('error', reject);
        request.setTimeout(30000, () => {
            request.abort();
            reject(new Error(`Timeout downloading ${url}`));
        });
    });
};

async function downloadNYCImages() {
    // Use the correct path relative to the script location
    const assetsDir = path.join(__dirname, '..', 'src', 'assets', 'unsplash');

    // Ensure directory exists
    if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
    }

    console.log(`🗽 Starting download of ${nycImages.length} NYC filming location images...`);
    console.log(`📁 Target directory: ${assetsDir}`);

    let downloaded = 0;
    let failed = 0;
    let skipped = 0;

    for (const image of nycImages) {
        const filepath = path.join(assetsDir, image.filename);

        // Check if file already exists
        if (fs.existsSync(filepath)) {
            console.log(`⏭️  Skipped: ${image.filename} (already exists)`);
            skipped++;
            continue;
        }

        try {
            console.log(`📥 Downloading: ${image.filename}...`);
            await downloadImage(image.url, filepath);
            downloaded++;
            console.log(`✅ Downloaded: ${image.filename}`);

            // Add a small delay between downloads to be respectful to Unsplash
            await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
            failed++;
            console.error(`❌ Failed to download ${image.filename}:`, error.message);
        }
    }

    console.log(`\n🎬 NYC Images Download Complete!`);
    console.log(`✅ Successfully downloaded: ${downloaded} images`);
    console.log(`⏭️  Skipped (already exists): ${skipped} images`);
    console.log(`❌ Failed: ${failed} images`);

    // Update manifest file with new NYC images
    const manifestPath = path.join(assetsDir, 'manifest.json');
    let manifest = {};

    if (fs.existsSync(manifestPath)) {
        try {
            manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        } catch (error) {
            console.log('📄 Creating new manifest file...');
            manifest = { images: [] };
        }
    } else {
        manifest = { images: [] };
    }

    // Add new NYC images to manifest
    const existingFilenames = manifest.images ? manifest.images.map(img => img.filename) : [];
    const newImages = nycImages.filter(img => !existingFilenames.includes(img.filename));

    if (newImages.length > 0) {
        manifest.lastUpdate = new Date().toISOString();
        manifest.images = manifest.images || [];
        manifest.images.push(...newImages.map(img => ({
            filename: img.filename,
            altText: img.altText,
            source: img.source,
            originalUrl: img.url,
            tags: img.tags,
            category: 'nyc-locations',
            addedDate: new Date().toISOString()
        })));

        fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
        console.log(`📄 Updated manifest.json with ${newImages.length} new NYC images`);
    }

    console.log(`\n🎯 All NYC filming location images are now available in:`);
    console.log(`   ${assetsDir}`);
}

// Add helpful usage information
function showUsage() {
    console.log(`
🗽 NYC Film Locations Image Downloader
=====================================

This script downloads 30 high-quality NYC filming location images from Unsplash.

Usage:
  node scripts/download-nyc-images.js

Features:
  • Downloads 30 NYC-specific filming locations
  • Skips already downloaded images
  • Updates manifest.json with metadata
  • Comprehensive coverage of all 5 NYC boroughs
  
Location Categories Included:
  • Manhattan Landmarks (5 images)
    - Times Square, Central Park, Wall Street, Empire State Building
  • Brooklyn Areas (8 images) 
    - Brooklyn Bridge, DUMBO, Williamsburg, Coney Island, Prospect Park
  • Transportation & Urban Infrastructure (5 images)
    - Subway stations, rooftops, Grand Central, yellow cabs, fire escapes
  • Cultural Neighborhoods (7 images)
    - Chinatown, Little Italy, SoHo, Greenwich Village, East Village, Harlem, Tribeca
  • Outer Boroughs & Unique Locations (5 images)
    - Staten Island Ferry, Queens, Bronx, High Line, One World Trade Center
`);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
    if (process.argv.includes('--help') || process.argv.includes('-h')) {
        showUsage();
    } else {
        downloadNYCImages().catch(console.error);
    }
}

export { downloadNYCImages, nycImages };
