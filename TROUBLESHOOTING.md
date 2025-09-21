# News Images Troubleshooting Guide

## Issue: Getting "Not Found" Error

Based on your error message:
```json
{
  "imageError": "Failed to fetch news image: Not Found"
}
```

This suggests the API endpoint is not responding properly. Here's how to debug and fix:

## Step 1: Check Backend Server

1. **Make sure backend is running**:
   ```bash
   cd backend
   npm start  # or node server.js
   ```

2. **Check server logs** for any errors when starting

3. **Verify port** - Backend should be running on port 4000

## Step 2: Test API Endpoints

1. **Test health endpoint**:
   ```bash
   curl http://localhost:4000/api/news-images/health
   ```
   
   Should return:
   ```json
   {
     "status": "ok",
     "config": {
       "hasApiKey": true,
       "hasCxId": true
     }
   }
   ```

2. **Run the test script**:
   ```bash
   cd backend
   chmod +x test-news-images.sh
   ./test-news-images.sh
   ```

## Step 3: Check Google API Configuration

The route requires these environment variables in your `.env` file:

```env
GOOGLE_CUSTOM_SEARCH_API_KEY=your_api_key_here
GOOGLE_CUSTOM_SEARCH_CX_ID=your_cx_id_here
```

### Get Google API Credentials:

1. **Google Custom Search API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "Custom Search API"
   - Create credentials > API Key
   
2. **Custom Search Engine ID (CX)**:
   - Go to [Google Custom Search](https://cse.google.com/)
   - Create a new search engine
   - Set it to search "Entire web"
   - Enable "Image search" in Settings > Advanced
   - Copy the "Search engine ID"

## Step 4: Frontend Testing

1. **Visit test page**: `http://localhost:3000/test-images`

2. **Check browser console** for network errors

3. **Verify API endpoint** in browser dev tools Network tab

## Step 5: Common Issues & Fixes

### Issue: "hasApiKey": false or "hasCxId": false
**Fix**: Add missing environment variables to `.env` file and restart server

### Issue: Network error / Connection refused
**Fix**: Make sure backend server is running on correct port

### Issue: Google API quota exceeded
**Fix**: Check your Google Cloud Console for API usage limits

### Issue: "No images found"
**Fix**: Try broader search terms, or check if your Custom Search Engine is configured for images

### Issue: CORS errors
**Fix**: Make sure your backend has CORS enabled (should already be configured)

## Step 6: Debug Mode

The updated `newsImagesRoute.js` now includes detailed logging. Check your backend console for messages like:

```
[newsImagesRoute] POST request - searchTerm: "netflix production in brooklyn", newsType: "production"
[newsImagesRoute] API Key: Present, CX: Present
[newsImagesRoute] Enhanced query: "netflix production in brooklyn movie film production behind scenes"
[newsImagesRoute] Google API response status: 200
[newsImagesRoute] Items found: 3
[newsImagesRoute] Success - Primary image: https://...
```

## Quick Test Commands

```bash
# Test health
curl http://localhost:4000/api/news-images/health

# Test image search
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"searchTerm": "netflix", "newsType": "production"}' \
  http://localhost:4000/api/news-images

# Check if route is registered
curl http://localhost:4000/api/news-images/health
```

## Success Indicators

✅ Health endpoint returns `"status": "ok"`  
✅ API credentials show as `"hasApiKey": true, "hasCxId": true`  
✅ Backend logs show successful Google API responses  
✅ Frontend test page displays images  
✅ News cards show images automatically  

If you're still having issues after following these steps, please share:
1. Backend server logs
2. Browser console errors
3. Output from the health endpoint
