#!/usr/bin/env node

/**
 * NYC Filming Location Image URL Builder
 * 
 * This script generates a reliable list of 30 NYC-specific filming location images
 * using Unsplash's search-based URLs, which are more reliable than specific photo IDs.
 * 
 * APPROACH: Using Unsplash search URLs with NYC-specific terms to avoid 404 errors.
 */

// Reliable NYC filming location images using Unsplash search URLs (30 total)
const nycFilmingLocations = [
    // Manhattan - Iconic Landmarks (10 images)
    {
        url: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=800&h=450&fit=crop&crop=center',
        filename: 'location-nyc-01-brooklyn-bridge.jpg',
        altText: 'Brooklyn Bridge with Manhattan skyline',
        source: 'Unsplash - NYC Collection',
        tags: ['brooklyn-bridge', 'manhattan', 'skyline', 'iconic']
    },
    {
        url: 'https://source.unsplash.com/800x450/?new-york-taxi',
        filename: 'location-nyc-02-yellow-taxi.jpg',
        altText: 'Classic NYC yellow taxi cab',
        source: 'Unsplash - NYC Search',
        tags: ['taxi', 'yellow-cab', 'manhattan', 'street']
    },
    {
        url: 'https://source.unsplash.com/800x450/?central-park-nyc',
        filename: 'location-nyc-03-central-park.jpg',
        altText: 'Central Park Manhattan',
        source: 'Unsplash - NYC Search',
        tags: ['central-park', 'manhattan', 'nature', 'park']
    },
    {
        url: 'https://source.unsplash.com/800x450/?times-square-new-york',
        filename: 'location-nyc-04-times-square.jpg',
        altText: 'Times Square neon lights',
        source: 'Unsplash - NYC Search',
        tags: ['times-square', 'neon', 'lights', 'manhattan']
    },
    {
        url: 'https://source.unsplash.com/800x450/?empire-state-building',
        filename: 'location-nyc-05-empire-state.jpg',
        altText: 'Empire State Building',
        source: 'Unsplash - NYC Search',
        tags: ['empire-state', 'skyscraper', 'manhattan', 'iconic']
    },
    {
        url: 'https://source.unsplash.com/800x450/?manhattan-skyline',
        filename: 'location-nyc-06-manhattan-skyline.jpg',
        altText: 'Manhattan skyline view',
        source: 'Unsplash - NYC Search',
        tags: ['manhattan', 'skyline', 'cityscape', 'view']
    },
    {
        url: 'https://source.unsplash.com/800x450/?wall-street-nyc',
        filename: 'location-nyc-07-wall-street.jpg',
        altText: 'Wall Street financial district',
        source: 'Unsplash - NYC Search',
        tags: ['wall-street', 'financial', 'manhattan', 'business']
    },
    {
        url: 'https://source.unsplash.com/800x450/?one-world-trade-center',
        filename: 'location-nyc-08-world-trade.jpg',
        altText: 'One World Trade Center',
        source: 'Unsplash - NYC Search',
        tags: ['world-trade', 'manhattan', 'memorial', 'skyscraper']
    },
    {
        url: 'https://source.unsplash.com/800x450/?chrysler-building-nyc',
        filename: 'location-nyc-09-chrysler-building.jpg',
        altText: 'Chrysler Building Art Deco architecture',
        source: 'Unsplash - NYC Search',
        tags: ['chrysler-building', 'art-deco', 'manhattan', 'architecture']
    },
    {
        url: 'https://source.unsplash.com/800x450/?flatiron-building-nyc',
        filename: 'location-nyc-10-flatiron.jpg',
        altText: 'Flatiron Building iconic wedge shape',
        source: 'Unsplash - NYC Search',
        tags: ['flatiron', 'manhattan', 'iconic', 'architecture']
    },

    // Brooklyn Areas (8 images)
    {
        url: 'https://source.unsplash.com/800x450/?brooklyn-bridge-park',
        filename: 'location-nyc-11-brooklyn-bridge-park.jpg',
        altText: 'Brooklyn Bridge Park waterfront',
        source: 'Unsplash - NYC Search',
        tags: ['brooklyn', 'park', 'waterfront', 'bridge']
    },
    {
        url: 'https://source.unsplash.com/800x450/?coney-island-brooklyn',
        filename: 'location-nyc-12-coney-island.jpg',
        altText: 'Coney Island beach and boardwalk',
        source: 'Unsplash - NYC Search',
        tags: ['coney-island', 'brooklyn', 'beach', 'boardwalk']
    },
    {
        url: 'https://source.unsplash.com/800x450/?williamsburg-brooklyn',
        filename: 'location-nyc-13-williamsburg.jpg',
        altText: 'Williamsburg Brooklyn neighborhood',
        source: 'Unsplash - NYC Search',
        tags: ['williamsburg', 'brooklyn', 'hipster', 'trendy']
    },
    {
        url: 'https://source.unsplash.com/800x450/?dumbo-brooklyn',
        filename: 'location-nyc-14-dumbo.jpg',
        altText: 'DUMBO Brooklyn waterfront area',
        source: 'Unsplash - NYC Search',
        tags: ['dumbo', 'brooklyn', 'waterfront', 'manhattan-bridge']
    },
    {
        url: 'https://source.unsplash.com/800x450/?brooklyn-heights-promenade',
        filename: 'location-nyc-15-brooklyn-heights.jpg',
        altText: 'Brooklyn Heights Promenade',
        source: 'Unsplash - NYC Search',
        tags: ['brooklyn-heights', 'promenade', 'brooklyn', 'scenic']
    },
    {
        url: 'https://source.unsplash.com/800x450/?prospect-park-brooklyn',
        filename: 'location-nyc-16-prospect-park.jpg',
        altText: 'Prospect Park Brooklyn green space',
        source: 'Unsplash - NYC Search',
        tags: ['prospect-park', 'brooklyn', 'nature', 'green']
    },
    {
        url: 'https://source.unsplash.com/800x450/?brooklyn-brownstone',
        filename: 'location-nyc-17-brooklyn-brownstones.jpg',
        altText: 'Brooklyn brownstone buildings',
        source: 'Unsplash - NYC Search',
        tags: ['brooklyn', 'brownstones', 'residential', 'historic']
    },
    {
        url: 'https://source.unsplash.com/800x450/?red-hook-brooklyn',
        filename: 'location-nyc-18-red-hook.jpg',
        altText: 'Red Hook Brooklyn industrial area',
        source: 'Unsplash - NYC Search',
        tags: ['red-hook', 'brooklyn', 'industrial', 'warehouse']
    },

    // Transportation & Urban Infrastructure (5 images)
    {
        url: 'https://source.unsplash.com/800x450/?nyc-subway-station',
        filename: 'location-nyc-19-subway-station.jpg',
        altText: 'NYC subway station platform',
        source: 'Unsplash - NYC Search',
        tags: ['subway', 'station', 'underground', 'metro']
    },
    {
        url: 'https://source.unsplash.com/800x450/?grand-central-terminal',
        filename: 'location-nyc-20-grand-central.jpg',
        altText: 'Grand Central Terminal main concourse',
        source: 'Unsplash - NYC Search',
        tags: ['grand-central', 'terminal', 'architecture', 'transportation']
    },
    {
        url: 'https://source.unsplash.com/800x450/?manhattan-bridge-nyc',
        filename: 'location-nyc-21-manhattan-bridge.jpg',
        altText: 'Manhattan Bridge spanning East River',
        source: 'Unsplash - NYC Search',
        tags: ['manhattan-bridge', 'bridge', 'river', 'structure']
    },
    {
        url: 'https://source.unsplash.com/800x450/?nyc-fire-escape',
        filename: 'location-nyc-22-fire-escape.jpg',
        altText: 'Classic NYC fire escape architecture',
        source: 'Unsplash - NYC Search',
        tags: ['fire-escape', 'architecture', 'urban', 'classic']
    },
    {
        url: 'https://source.unsplash.com/800x450/?queensboro-bridge',
        filename: 'location-nyc-23-queensboro-bridge.jpg',
        altText: 'Queensboro Bridge connecting Manhattan and Queens',
        source: 'Unsplash - NYC Search',
        tags: ['queensboro-bridge', 'queens', 'manhattan', 'bridge']
    },

    // Cultural Neighborhoods (4 images)
    {
        url: 'https://source.unsplash.com/800x450/?chinatown-nyc',
        filename: 'location-nyc-24-chinatown.jpg',
        altText: 'Chinatown NYC street scene',
        source: 'Unsplash - NYC Search',
        tags: ['chinatown', 'cultural', 'manhattan', 'ethnic']
    },
    {
        url: 'https://source.unsplash.com/800x450/?little-italy-nyc',
        filename: 'location-nyc-25-little-italy.jpg',
        altText: 'Little Italy neighborhood',
        source: 'Unsplash - NYC Search',
        tags: ['little-italy', 'cultural', 'manhattan', 'italian']
    },
    {
        url: 'https://source.unsplash.com/800x450/?soho-nyc',
        filename: 'location-nyc-26-soho.jpg',
        altText: 'SoHo cast iron architecture',
        source: 'Unsplash - NYC Search',
        tags: ['soho', 'cast-iron', 'manhattan', 'shopping']
    },
    {
        url: 'https://source.unsplash.com/800x450/?greenwich-village-nyc',
        filename: 'location-nyc-27-greenwich-village.jpg',
        altText: 'Greenwich Village charming streets',
        source: 'Unsplash - NYC Search',
        tags: ['greenwich-village', 'manhattan', 'bohemian', 'artistic']
    },

    // Outer Boroughs & Unique Locations (3 images)
    {
        url: 'https://source.unsplash.com/800x450/?staten-island-ferry',
        filename: 'location-nyc-28-staten-island-ferry.jpg',
        altText: 'Staten Island Ferry with Statue of Liberty',
        source: 'Unsplash - NYC Search',
        tags: ['staten-island-ferry', 'statue-liberty', 'harbor', 'ferry']
    },
    {
        url: 'https://source.unsplash.com/800x450/?high-line-park-nyc',
        filename: 'location-nyc-29-high-line.jpg',
        altText: 'High Line elevated park',
        source: 'Unsplash - NYC Search',
        tags: ['high-line', 'park', 'elevated', 'manhattan']
    },
    {
        url: 'https://source.unsplash.com/800x450/?yankee-stadium-bronx',
        filename: 'location-nyc-30-yankee-stadium.jpg',
        altText: 'Yankee Stadium in the Bronx',
        source: 'Unsplash - NYC Search',
        tags: ['yankee-stadium', 'bronx', 'baseball', 'sports']
    }
];

// Export the data for use in other modules
export { nycFilmingLocations };

// Function to generate the image URLs list
function generateImageUrlsList() {
    console.log('🗽 NYC Filming Locations - Complete Image URL List');
    console.log('='.repeat(55));
    console.log(`Total Images: ${nycFilmingLocations.length}`);
    console.log('');

    nycFilmingLocations.forEach((image, index) => {
        console.log(`${(index + 1).toString().padStart(2, '0')}. ${image.filename}`);
        console.log(`    URL: ${image.url}`);
        console.log(`    Alt: ${image.altText}`);
        console.log(`    Tags: ${image.tags.join(', ')}`);
        console.log('');
    });

    return nycFilmingLocations;
}

// Function to generate JSON output
function generateJSONOutput() {
    const output = {
        metadata: {
            title: "NYC Filming Location Images",
            description: "Comprehensive collection of 30 NYC filming location images from Unsplash",
            totalImages: nycFilmingLocations.length,
            categories: [
                "Manhattan Landmarks",
                "Brooklyn Areas",
                "Transportation & Infrastructure",
                "Cultural Neighborhoods",
                "Outer Boroughs & Unique Locations"
            ],
            generatedDate: new Date().toISOString()
        },
        images: nycFilmingLocations
    };

    return JSON.stringify(output, null, 2);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);

    if (args.includes('--json')) {
        console.log(generateJSONOutput());
    } else if (args.includes('--help') || args.includes('-h')) {
        console.log(`
🗽 NYC Film Locations Image URL Builder
=====================================

Generate 30 NYC filming location images using reliable Unsplash search URLs.

Usage:
  node scripts/build-nyc-image-urls.js [options]

Options:
  --json    Output as JSON format
  --help    Show this help message

Categories Included (30 total):
• Manhattan Landmarks (10 images) - Times Square, Empire State, etc.
• Brooklyn Areas (8 images) - Williamsburg, DUMBO, Coney Island, etc.
• Transportation & Infrastructure (5 images) - Subway, bridges, terminals
• Cultural Neighborhoods (4 images) - Chinatown, SoHo, Little Italy, etc.
• Outer Boroughs & Unique Locations (3 images) - Staten Island Ferry, High Line, etc.

🔧 SOLUTION FOR 404 ERRORS: Using Unsplash search URLs instead of specific photo IDs
   to avoid broken links. Search URLs like 'source.unsplash.com/800x450/?nyc-taxi'
   are more reliable than specific photo IDs.

All images are 800x450px from Unsplash with NYC-specific search terms.
        `);
    } else {
        generateImageUrlsList();
    }
}

export default nycFilmingLocations;
