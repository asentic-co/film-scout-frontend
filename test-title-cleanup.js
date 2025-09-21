// Test script to verify title cleanup functionality

// Simple test class with just the cleanup function
class TestTitleService {
    /**
     * Clean up redundant words from article titles
     */
    cleanArticleTitle(title, type) {
        if (!title) return title;

        // Define redundant prefixes/patterns to remove
        const redundantPatterns = [
            // Generic patterns
            /^(Latest|Trending|Breaking|New|Update|News):\s*/i,
            /^(Latest|Trending|Breaking|New|Update)\s+(Production|Location)s?\s*(News|Update)?:?\s*/i,

            // Production-specific patterns
            /^(Production|Film|Movie|TV|Studio)\s+(News|Update|Spotlight|Alert):?\s*/i,
            /^(Latest|Trending|New)\s+(Film|Movie|Production)\s+(News|Update)?:?\s*/i,
            /^(Production\s+Spotlight|Now\s+Showing|Coming\s+Soon):?\s*/i,

            // Location-specific patterns
            /^(Location|Filming|Studio)\s+(News|Update|Spotlight|Alert):?\s*/i,
            /^(Latest|Trending|New)\s+(Location|Filming)\s+(News|Update)?:?\s*/i,
            /^(Interesting\s+Location|Unusual\s+Location|Famous\s+Location):?\s*/i,

            // Other common redundant starts
            /^(Industry|Hollywood|Entertainment)\s+(News|Update):?\s*/i,
            /^(Film|Movie|TV)\s+(Industry|News):?\s*/i
        ];

        let cleanedTitle = title.trim();

        // Remove redundant patterns
        for (const pattern of redundantPatterns) {
            cleanedTitle = cleanedTitle.replace(pattern, '');
        }

        // Clean up any double spaces and trim
        cleanedTitle = cleanedTitle.replace(/\s+/g, ' ').trim();

        // Ensure title isn't empty after cleaning
        return cleanedTitle || title;
    }
}

// Create a test instance
const testService = new TestTitleService();

// Test cases
const testTitles = [
    'Latest Production: Marvel Studios Begins Filming',
    'Production Spotlight: New Netflix Series Starts',
    'Trending Location: Central Park Attracts Filmmakers',
    'Location Update: Brooklyn Bridge Filming Permits',
    'Coming Soon: Spider-Man Returns to NYC',
    'Production News: HBO Max Announces New Show',
    'Latest Location News: Times Square Filming',
    'Netflix Announces Major Superhero Series', // Should stay the same
    'Brooklyn Studios Expand Facilities', // Should stay the same
    'News: Marvel Confirms Sequel' // Edge case
];

console.log('🧪 Testing Title Cleanup Function\n');

testTitles.forEach((title, index) => {
    const productionCleaned = testService.cleanArticleTitle(title, 'production');
    const locationCleaned = testService.cleanArticleTitle(title, 'location');

    console.log(`Test ${index + 1}:`);
    console.log(`  Original: "${title}"`);
    console.log(`  Production: "${productionCleaned}"`);
    console.log(`  Location: "${locationCleaned}"`);
    console.log('');
});
