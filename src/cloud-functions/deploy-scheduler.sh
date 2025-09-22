#!/bin/bash

# Deploy news refresh function with monthly schedule
# This will automatically refresh Firestore content every month

echo "Deploying scheduled news refresh function..."

gcloud functions deploy refreshNews \
    --gen2 \
    --runtime=nodejs22 \
    --region=us-central1 \
    --source=. \
    --entry-point=refreshNews \
    --trigger-http \
    --allow-unauthenticated \
    --memory=256MB \
    --timeout=300s \
    --project=ai-solutions-441621

echo "Creating Cloud Scheduler job for monthly refresh..."

gcloud scheduler jobs create http monthly-news-refresh \
    --location=us-central1 \
    --schedule="0 0 1 * *" \
    --uri="https://us-central1-ai-solutions-441621.cloudfunctions.net/refreshNews" \
    --http-method=GET \
    --project=ai-solutions-441621

echo "✅ Monthly news refresh scheduled!"
echo "📅 Will run on the 1st of every month at midnight UTC"
