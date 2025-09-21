// Debug what's happening with production images in the browser
async function debugProductionImages() {
    console.log('🔍 Debugging Production Images in Browser...\n');

    // Test direct API call
    try {
        console.log('1. Testing direct API call...');
        const response = await fetch('https://us-central1-ai-solutions-441621.cloudfunctions.net/getNews?type=production&limit=1');
        const data = await response.json();
        console.log('✅ Direct API Response:', data[0]);
        console.log('   Has image?', !!data[0].image);
        console.log('   Image URL:', data[0].image?.url);
        console.log('');

        // Test through your frontend news service
        console.log('2. Testing through NewsServiceFactory...');

        // Try to access your news context from the browser
        const prodCards = document.querySelectorAll('[class*="production"]');
        console.log('📊 Found production card elements:', prodCards.length);

        // Check if images are present in DOM
        const productionImages = document.querySelectorAll('[class*="production"] .news-image');
        console.log('🖼️  Found production images in DOM:', productionImages.length);

        const locationImages = document.querySelectorAll('[class*="location"] .news-image');
        console.log('🖼️  Found location images in DOM:', locationImages.length);

        // Check for any broken images
        const allImages = document.querySelectorAll('.news-image');
        console.log('🎯 All news images found:', allImages.length);

        allImages.forEach((img, index) => {
            console.log(`Image ${index + 1}:`, {
                src: img.src,
                loaded: img.complete && img.naturalHeight !== 0,
                displayed: img.style.display !== 'none',
                className: img.closest('[class*="card"]')?.className
            });
        });

    } catch (error) {
        console.error('❌ Debug failed:', error);
    }
}

// Auto-run when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', debugProductionImages);
} else {
    debugProductionImages();
}

console.log('🔧 Debug script loaded. Run debugProductionImages() in console to test.');
