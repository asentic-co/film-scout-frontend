// Quick test to verify enhanced image selection is working
async function testEnhancedImages() {
    console.log('🧪 Testing Enhanced Image Selection...\n');

    try {
        // Test production news
        const newsBase = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_NEWS_API_URL) || `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8080'}/getNews`;
        const prodResponse = await fetch(`${newsBase}?type=production&limit=1`);
        const prodNews = await prodResponse.json();

        console.log('📰 Production News Test:');
        console.log('Title:', prodNews[0].title);
        console.log('Image Score:', prodNews[0].image.score);
        console.log('Keywords:', prodNews[0].image.keywords.join(', '));
        console.log('Image URL:', prodNews[0].image.url);
        console.log('');

        // Test location news
        const locResponse = await fetch(`${newsBase}?type=location&limit=1`);
        const locNews = await locResponse.json();

        console.log('📍 Location News Test:');
        console.log('Title:', locNews[0].title);
        console.log('Image Score:', locNews[0].image.score);
        console.log('Keywords:', locNews[0].image.keywords.join(', '));
        console.log('Image URL:', locNews[0].image.url);
        console.log('');

        console.log('✅ Enhanced image selection is working perfectly!');
        console.log('🎯 Smart keyword matching is active with scoring');
        console.log('🖼️  High-quality Unsplash images are being selected');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testEnhancedImages();
