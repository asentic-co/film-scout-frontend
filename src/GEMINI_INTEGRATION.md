# Gemini AI-Powered News Service with Image Generation

Transform your FilmScout news experience with Google Gemini's intelligent content generation, smart image selection, and source linking.

## 🤖 What This Adds

Instead of relying on external news APIs or static content, this enhanced service uses **Google Gemini AI** to:

- **Generate Fresh Content**: Create industry-relevant news summaries monthly
- **Smart Image Selection**: Automatically select contextual images for each article
- **Visual Enhancement**: Add professional film industry imagery to news cards
- **Smart Source Linking**: Provide realistic publication URLs and sources
- **Industry Context**: Focus specifically on film production and location topics
- **Quality Control**: Mix AI-generated content with curated fallbacks
- **Cost Effective**: Generate unlimited content with images for ~$3-5/month

## 🏗️ Enhanced Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                Gemini AI + Image Integration                │
├─────────────────────────────────────────────────────────────┤
│ Gemini API ────▶ Smart Prompts ────▶ Industry News Content │
│      │                     │                      │        │
│      ▼                     ▼                      ▼        │
│ Image Selection    Context-Aware         Source Linking    │
│  & Fallbacks       Generation           & Validation       │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                Enhanced Cloud Functions                     │
├─────────────────────────────────────────────────────────────┤
│ • AI Content Generation     • Smart Image Selection        │
│ • Fallback Image Service    • Visual Optimization          │
│ • Contextual Image Matching • Quality Validation           │
│ • Professional Imagery      • Error Handling               │
└─────────────────────────────────────────────────────────────┘
```

## ✨ Key Features

### 🎯 **Industry-Specific Content**
- Production news: streaming, AI in filmmaking, studio partnerships
- Location news: incentives, facilities, international filming
- Current trends: sustainability, diversity, technology

### 🎨 **Smart Image Integration**
- Contextual image selection based on article content
- Professional film industry imagery from curated sources
- Intelligent fallback system with keyword matching
- Visual indicators for AI-generated vs stock images
- Optimized image loading with lazy loading and error handling

### 🔗 **Intelligent Source Linking**
- Realistic URLs for major publications (Variety, THR, Deadline)
- Source attribution with publication names
- Visual indicators for AI-generated vs fallback content

### 🛡️ **Reliability & Fallbacks**
- Graceful degradation when AI API is unavailable
- Mix of AI-generated and curated content for reliability
- Smart image fallback service with keyword matching
- Cached responses to prevent repeated API calls

### 💰 **Cost Optimization**
- Monthly generation reduces API costs
- Smart caching prevents unnecessary requests
- Fallback mixing ensures content availability
- Image optimization for faster loading

## 🚀 Setup & Deployment

### 1. **Get Gemini API Key**
```bash
# Visit: https://makersuite.google.com/app/apikey
# Create new API key
export GEMINI_API_KEY=your_api_key_here
```

### 2. **Deploy with AI Integration**
```bash
cd cloud-functions
chmod +x deploy.sh
./deploy.sh
```

### 3. **Verify AI Integration**
```bash
# Test AI news generation
curl -X POST https://your-region-project.cloudfunctions.net/aggregateNews

# Check generated content
curl "https://your-region-project.cloudfunctions.net/getNews?type=production&limit=3"
```

## 🎨 Frontend Integration

Your news cards now automatically display:

```jsx
// Enhanced AI-generated content with images and source links
{
  "title": "Netflix Expands AI-Assisted Content Creation Tools",
  "summary": "Streaming giant introduces new machine learning tools...",
  "source": "Variety",
  "sourceUrl": "https://variety.com/netflix-ai-content-creation-tools",
  "isGenerated": true,  // 🤖 AI indicator
  "isFallback": false,
  "image": {
    "url": "https://images.unsplash.com/photo-1516035069371...",
    "altText": "Film production with professional cameras and crew: Netflix Expands AI Tools",
    "isGenerated": false,
    "isFallback": true,
    "source": "Unsplash"
  }
}
```

### Visual Indicators
- 🤖 **AI Generated**: Shows for Gemini-created content
- 🎨 **AI Image**: Shows for generated images
- 📦 **Cached**: Shows for fallback/cached content
- **Read Full Article →**: Links to source (with fallback handling)

### Enhanced CSS Features
```css
.news-image-container {
  position: relative;
  margin-bottom: 1rem;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.news-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-ai-indicator {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(4px);
  padding: 4px 8px;
  border-radius: 12px;
}
```
- 📦 **Cached**: Shows for fallback/cached content
- **Read Full Article →**: Links to source (with fallback handling)

## 📊 Content Quality

### **AI Prompt Engineering**
The service uses carefully crafted prompts that:
- Request specific JSON structure
- Focus on current industry trends (July 2025)
- Include realistic publication sources
- Maintain professional tone
- Generate 50-80 word summaries

### **Content Validation**
- JSON structure validation
- URL format verification
- Content length checks
- Fallback mixing for reliability

## 💡 Sample Generated Content

**Production News with Image:**
```
"AI-Powered Virtual Production Reaches New Milestone"
"Leading studios report 40% cost reduction using advanced LED wall 
technology and real-time rendering, revolutionizing how films are made 
with sustainable practices at the forefront..."
Source: The Hollywood Reporter
Image: Professional virtual production studio with LED volume walls
```

**Location News with Image:**
```
"Europe Launches Unified Film Incentive Program"
"EU announces streamlined tax credit system across member states, making 
cross-border productions 30% more efficient while promoting cultural 
exchange and local economies..."
Source: Screen International
Image: Scenic European filming location with historic architecture
```

## 🎨 Image Selection Intelligence

### **Contextual Matching**
The service intelligently selects images based on:
- **Keywords in title and summary**: "Netflix" → streaming studio imagery
- **Location mentions**: "NYC" → Manhattan skyline, "High Line" → elevated park
- **Production type**: "AI/Virtual" → futuristic studio setups
- **Category context**: Production vs Location specific imagery

### **Fallback Strategy**
1. **Keyword Scoring**: Match article content to image keywords
2. **Category Defaults**: Production → cameras/studios, Location → cityscapes
3. **Random Selection**: If no matches, select from curated collection
4. **Error Handling**: Graceful fallback to placeholder if image fails

### **Image Sources**
- **Curated Collection**: Professional film industry imagery
- **Unsplash Integration**: High-quality stock photography
- **Optimization**: Automatic resizing and format optimization
- **Performance**: Lazy loading and error handling

## 🔧 Configuration Options

### **Environment Variables**
```bash
GEMINI_API_KEY=your_key              # Required for AI generation
GEMINI_MODEL=gemini-1.5-flash        # AI model to use
NEWS_GENERATION_ENABLED=true         # Enable/disable AI
NEWS_FALLBACK_MIX_RATIO=0.2         # Mix 20% fallback content
```

### **Content Customization**
Modify prompts in `GeminiNewsService.js` to:
- Target specific industry segments
- Adjust content tone/style
- Include different publication sources
- Change summary length

## 📈 Cost Analysis

### **Gemini API Pricing** (Estimated)
- **Input tokens**: ~500 tokens per request
- **Output tokens**: ~1,500 tokens per response
- **Monthly cost**: $1-2 for 6 news items/month
- **Compared to news APIs**: 90% cost reduction

### **Total Monthly Cost**
- Gemini API: ~$1-2
- Cloud Functions: ~$2-4 (increased for image processing)
- Firestore: ~$1
- Image Storage: ~$1
- **Total: ~$5-8/month** (vs $50-100 for premium news APIs + image licensing)

## 🔍 Monitoring & Analytics

### **Cloud Console Monitoring**
- Function execution logs
- API request success rates
- Generated content quality
- Cache hit ratios

### **Debug Commands**
```bash
# View enhanced AI generation logs
gcloud functions logs read aggregateNewsWithImages --limit=20

# Test enhanced news generation with images
curl -X POST "https://your-function-url/aggregateNewsWithImages" \
  -H "Content-Type: application/json"

# Test image-enhanced news API
curl "https://your-function-url/getNews?type=production&limit=3"

# Check secret manager
gcloud secrets versions list gemini-api-key
```

## 🛠️ Troubleshooting

### **Common Issues**

1. **API Key Issues**
   ```bash
   # Verify secret exists
   gcloud secrets describe gemini-api-key
   
   # Update secret
   echo "new_key" | gcloud secrets versions add gemini-api-key --data-file=-
   ```

2. **Content Quality Issues**
   - Adjust prompt temperature (0.6-0.8)
   - Modify topic suggestions
   - Increase fallback mix ratio

3. **Cost Optimization**
   - Reduce generation frequency
   - Implement smarter caching
   - Use shorter prompts

## 🚀 Future Enhancements

- **AI Image Generation**: Direct integration with Vertex AI for custom imagery
- **Multi-language Support**: Generate content in different languages
- **Trend Analysis**: Use AI to identify emerging industry topics
- **Personalization**: Tailor content to user preferences
- **Real-time Updates**: Generate breaking news summaries
- **Video Thumbnails**: Generate video content previews
- **Interactive Elements**: Add polls, quizzes, and engagement features

This enhanced AI-powered approach gives you **unlimited, high-quality industry content with professional imagery** while maintaining reliability and keeping costs low!
