# FilmScout News Service

A Google Cloud Functions-based news aggregation service that provides fresh content for FilmScout's production and location cards.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Cloud Scheduler│────▶│  Aggregator     │────▶│   Firestore     │
│  (Monthly)      │    │  Function       │    │   Database      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
┌─────────────────┐    ┌─────────────────┐             │
│  Frontend App   │◄───│  News API       │◄────────────┘
│  (React)        │    │  Function       │
└─────────────────┘    └─────────────────┘
```

## Features

- 🔄 **Monthly Auto-Refresh**: Cloud Scheduler triggers news aggregation monthly
- 🗄️ **Firestore Storage**: Cached news data for fast retrieval
- 🌍 **CORS Enabled**: Frontend can call API from any domain
- 📱 **Responsive Design**: Cards adapt to different screen sizes
- ⚡ **Fallback Content**: Graceful degradation when API is unavailable
- 🔍 **Type Filtering**: Separate endpoints for production vs location news

## Deployment Instructions

### Prerequisites

1. Google Cloud Project with billing enabled
2. `gcloud` CLI installed and authenticated
3. Node.js 18+ installed locally

### Quick Deploy

1. **Clone and navigate to functions directory:**
   ```bash
   cd src/cloud-functions
   ```

2. **Update project ID in deploy.sh:**
   ```bash
   # Edit deploy.sh and replace "your-project-id" with your actual project ID
   nano deploy.sh
   ```

3. **Make deploy script executable and run:**
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

4. **Update frontend configuration:**
   ```javascript
   // In src/services/newsService.js, update baseUrl with your function URL
   this.baseUrl = 'https://us-central1-your-project.cloudfunctions.net';
   ```

### Manual Deployment

If you prefer manual deployment:

```bash
# Install dependencies
npm install

# Deploy functions individually
gcloud functions deploy aggregateNews --runtime nodejs18 --trigger-http --allow-unauthenticated
gcloud functions deploy getNews --runtime nodejs18 --trigger-http --allow-unauthenticated

# Set up scheduler
gcloud scheduler jobs create http monthly-news-aggregation \
  --location=us-central1 \
  --schedule="0 0 1 * *" \
  --uri="https://us-central1-your-project.cloudfunctions.net/aggregateNews" \
  --http-method=POST
```

## API Endpoints

### GET `/getNews`

Retrieves cached news items from Firestore.

**Parameters:**
- `type` (required): `'production'` or `'location'`
- `limit` (optional): Number of items to return (default: 3)

**Example:**
```
GET https://us-central1-your-project.cloudfunctions.net/getNews?type=production&limit=3
```

**Response:**
```json
[
  {
    "id": "prod_123456_1",
    "title": "Major Studio Announces New Film Slate",
    "summary": "Leading entertainment company reveals ambitious production schedule...",
    "date": "2025-07-17T10:00:00.000Z",
    "category": "production",
    "source": "Entertainment Weekly"
  }
]
```

### POST `/aggregateNews`

Triggers news aggregation from external sources and updates Firestore.

**Example:**
```bash
curl -X POST https://us-central1-your-project.cloudfunctions.net/aggregateNews
```

## Custom Domain Setup

To use `news.filmscout.app`:

1. **Create a Load Balancer:**
   ```bash
   gcloud compute url-maps create news-lb --default-service=your-backend-service
   ```

2. **Set up SSL certificate:**
   ```bash
   gcloud compute ssl-certificates create news-ssl-cert \
     --domains=news.filmscout.app
   ```

3. **Configure DNS:**
   - Add CNAME record: `news.filmscout.app` → Load Balancer IP

## Local Development

```bash
cd cloud-functions
npm install
npm start
```

The function will be available at `http://localhost:8080`

## Environment Variables

For production, consider setting:

- `NEWS_API_KEY`: API key for external news sources
- `FIRESTORE_PROJECT_ID`: Project ID for Firestore
- `CORS_ORIGINS`: Allowed origins for CORS

## Monitoring

View logs and metrics in Google Cloud Console:
- **Functions**: Cloud Functions → Select function → Logs tab
- **Scheduler**: Cloud Scheduler → View job execution history
- **Firestore**: Firestore → View document updates

## Cost Estimation

Monthly costs (estimated):
- Cloud Functions: ~$1-5 (based on invocations)
- Firestore: ~$1-3 (for document reads/writes)
- Cloud Scheduler: ~$0.10
- **Total: ~$2-8/month**

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure `Access-Control-Allow-Origin` headers are set
   - Check that frontend domain is allowed

2. **Function Timeout:**
   - Increase timeout in deployment script
   - Optimize news fetching logic

3. **Firestore Permissions:**
   - Verify Cloud Functions have Firestore access
   - Check IAM roles and permissions

### Debug Commands

```bash
# View function logs
gcloud functions logs read getNews --limit=50

# Test function locally
functions-framework --target=getNews --port=8080

# Check scheduler job status
gcloud scheduler jobs describe monthly-news-aggregation --location=us-central1
```

## Future Enhancements

- 🔗 **RSS Feed Integration**: Add RSS feeds from industry publications
- 🤖 **AI Summarization**: Use Google Cloud AI to summarize long articles
- 📊 **Analytics**: Track popular news items and user engagement
- 🔔 **Push Notifications**: Alert users about breaking news
- 🌐 **Multi-language**: Support for international news sources
