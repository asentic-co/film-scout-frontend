# News Images Integration

This document explains the new Google Images integration for the News module, based on the existing `actorImageRoute` pattern.

## Overview

The News Images feature automatically enhances news articles with relevant images fetched from Google Images, similar to how actor images are fetched for the Dashboard cards.

## Components

### Backend: `newsImagesRoute.js`
- **Location**: `/backend/routes/newsImagesRoute.js`
- **Purpose**: Express route that uses Google Custom Search API to fetch images for news articles
- **Endpoints**:
  - `POST /news-images` - Fetch images for a search term
  - `GET /news-images/search?q=term&type=production|location` - Alternative query interface

### Frontend: `newsImageClient.js`
- **Location**: `/frontend/src/utils/newsImageClient.js`
- **Purpose**: Client utility for interacting with the news images API
- **Key Methods**:
  - `fetchNewsImage(searchTerm, newsType)` - Get images for a specific term
  - `enhanceNewsItemWithImage(newsItem)` - Add image data to a news item
  - `enhanceNewsItemsWithImages(newsItems)` - Batch process multiple news items

### Enhanced NewsService
- **Location**: `/frontend/src/services/NewsService.js`
- **Enhancement**: Automatically fetches and attaches images to news items
- **Configuration**: Can be enabled/disabled via `VITE_ENABLE_NEWS_IMAGES` environment variable

## Usage

### Automatic Integration (Recommended)
Images are automatically added to news items when the NewsService fetches data:

```javascript
const newsService = new NewsService();
const productionNews = await newsService.getProductionNews(3);
// News items now include image property if available
```

### Manual Usage
For custom implementations:

```javascript
import newsImageClient from '../utils/newsImageClient';

// Enhance a single news item
const enhancedItem = await newsImageClient.enhanceNewsItemWithImage({
  title: "Netflix Production in Brooklyn",
  summary: "New series filming in NYC",
  type: "production"
});

// Direct image search
const imageData = await newsImageClient.fetchNewsImage("Netflix filming Brooklyn", "production");
```

## Data Structure

Enhanced news items include these additional properties:

```javascript
{
  // Original news item properties
  id: 1,
  title: "Netflix Production in Brooklyn",
  summary: "New series filming in NYC neighborhoods",
  date: "2025-07-22T...",
  source: "Industry News",
  type: "production",
  
  // New image properties
  image: {
    url: "https://...",           // Full-size image URL
    thumbnail: "https://...",     // Thumbnail URL
    altText: "Image related to Netflix filming Brooklyn",
    title: "Behind the scenes...", // Image title from Google
    width: 800,                   // Image dimensions
    height: 600,
    isGenerated: false,           // Always false for Google Images
    contextUrl: "https://..."     // Source webpage URL
  },
  imageAlternatives: [...],       // Array of alternative images
  imageSearchTerm: "netflix filming brooklyn", // Processed search term
  imageError: null                // Any error that occurred during image fetch
}
```

## Configuration

### Environment Variables

**Backend** (requires Google Custom Search API):
- `GOOGLE_CUSTOM_SEARCH_API_KEY` - Your Google API key
- `GOOGLE_CUSTOM_SEARCH_CX_ID` - Your Custom Search Engine ID

**Frontend**:
- `VITE_ENABLE_NEWS_IMAGES=true` - Enable/disable image enhancement (default: true)
- `VITE_API_URL` - Backend API base URL

### Search Enhancement

The system automatically enhances search terms based on news type:
- **Production news**: Adds "movie film production behind scenes"
- **Location news**: Adds "filming location NYC movie set"
- **General news**: Adds "film industry news"

## Testing

Visit `/test-images` route in your app to test the functionality:
1. Manual search testing with custom terms
2. News item enhancement testing with sample data
3. Visual display of results and alternatives

## Error Handling

The system gracefully handles failures:
- API errors return fallback structure with null image
- Individual image load failures are caught by NewsCard component
- Fallback news data can still be enhanced with images
- Rate limiting and API quotas are managed through batch processing

## Performance Considerations

- Images are processed in batches (default: 3 concurrent requests)
- Lazy loading is used in NewsCard component
- Thumbnail URLs provided for faster loading
- Image enhancement can be disabled via environment variable

## Integration with Existing Components

The NewsCard component already supports the image structure:
- Displays image if available
- Shows AI/generated indicators
- Handles image load errors gracefully
- Responsive image sizing

No changes needed to existing News cards - they automatically display images when available.
