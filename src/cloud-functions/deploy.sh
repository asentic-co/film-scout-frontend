#!/bin/bash

# FilmScout News Service with Gemini AI Deployment Script
# This script sets up the complete Google Cloud infrastructure with AI-powered news

PROJECT_ID="ai-solutions-441621"
REGION="us-central1"
# Note: No service account needed for Gemini API access - just using the default Cloud Functions service account

echo "🚀 Deploying FilmScout News Service with Gemini AI to Google Cloud..."

# Check if Gemini API key is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  Warning: GEMINI_API_KEY environment variable not set"
    echo "   Get your API key from: https://makersuite.google.com/app/apikey (Generative Language API)"
    echo "   Note: You do NOT need a service account or special permissions - just the API key"
    echo "   Export it: export GEMINI_API_KEY=your_api_key"
    echo ""
    read -p "Do you want to continue with fallback data only? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "📋 Enabling required Google Cloud APIs..."
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable cloudscheduler.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable secretmanager.googleapis.com

# Create Firestore database (if not exists)
echo "🗄️ Setting up Firestore database..."
gcloud firestore databases create --region=$REGION --type=firestore-native 2>/dev/null || echo "Firestore database already exists"

# Store Gemini API key in Secret Manager
if [ ! -z "$GEMINI_API_KEY" ]; then
    echo "🔐 Storing Gemini API key in Secret Manager..."
    echo "$GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=- 2>/dev/null || \
    echo "$GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key --data-file=-
fi

# Deploy Cloud Functions with environment variables
echo "☁️ Deploying Cloud Functions with AI capabilities and image generation..."

# Deploy enhanced news aggregator function with images
gcloud functions deploy aggregateNewsWithImages \
  --runtime nodejs22 \
  --trigger-http \
  --allow-unauthenticated \
  --region=$REGION \
  --memory=1024MB \
  --timeout=540s \
  --set-env-vars="GEMINI_MODEL=gemini-1.5-flash" \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest"

# Deploy original news aggregator function for backward compatibility
gcloud functions deploy aggregateNews \
  --runtime nodejs22 \
  --trigger-http \
  --allow-unauthenticated \
  --region=$REGION \
  --memory=512MB \
  --timeout=540s \
  --set-env-vars="GEMINI_MODEL=gemini-1.5-flash" \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest"

# Deploy news API function  
gcloud functions deploy getNews \
  --runtime nodejs22 \
  --trigger-http \
  --allow-unauthenticated \
  --region=$REGION \
  --memory=256MB \
  --timeout=60s

# Create Cloud Scheduler job for monthly news aggregation
echo "⏰ Setting up Cloud Scheduler for monthly AI news generation..."
gcloud scheduler jobs create http monthly-news-aggregation \
  --location=$REGION \
  --schedule="0 0 1 * *" \
  --uri="https://$REGION-$PROJECT_ID.cloudfunctions.net/aggregateNews" \
  --http-method=POST \
  --description="Monthly AI-powered news aggregation for FilmScout" \
  2>/dev/null || echo "Scheduler job already exists"

# Create a test scheduler job for immediate testing (optional)
echo "🧪 Creating test job for immediate news generation..."
gcloud scheduler jobs create http test-news-generation \
  --location=$REGION \
  --schedule="0 */6 * * *" \
  --uri="https://$REGION-$PROJECT_ID.cloudfunctions.net/aggregateNews" \
  --http-method=POST \
  --description="Test job - AI news generation every 6 hours" \
  2>/dev/null || echo "Test scheduler job already exists"

# Get function URLs
echo "🔗 Getting function URLs..."
NEWS_API_URL=$(gcloud functions describe getNews --region=$REGION --format="value(httpsTrigger.url)")
AGGREGATOR_URL=$(gcloud functions describe aggregateNews --region=$REGION --format="value(httpsTrigger.url)")

echo ""
echo "✅ Deployment complete with Gemini AI integration!"
echo ""
echo "📍 Function URLs:"
echo "   News API: $NEWS_API_URL"
echo "   AI Aggregator: $AGGREGATOR_URL"
echo ""
echo "🤖 AI Features:"
echo "   • Gemini-powered news generation"
echo "   • Intelligent source linking"
echo "   • Industry-specific content"
echo "   • Fallback content mixing"
echo ""
echo "🔧 Next steps:"
echo "   1. Update frontend newsService.js with: $NEWS_API_URL"
echo "   2. Set up custom domain news.filmscout.app"
echo "   3. Test AI generation: curl -X POST $AGGREGATOR_URL"
echo "   4. Monitor Secret Manager for API key security"
echo ""
echo "💡 To test locally with AI:"
echo "   export GEMINI_API_KEY=your_key"
echo "   cd cloud-functions && npm install && npm start"
