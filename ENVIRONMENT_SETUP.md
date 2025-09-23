# Environment Configuration

This project supports multiple environments with different API configurations for two backend services:

- **Service 1 (API)**: Main backend for App/Dashboard components and Cards
- **Service 2 (News)**: Google Cloud Function for News page components

## Environment Files

### Local Development (`.env`)
```bash
# Service 1: Main API for App/Dashboard components and Cards
VITE_API_URL=http://localhost:4000

# Service 2: News API for News page components
VITE_NEWS_API_URL=http://localhost:8080/getNews

# Environment identifier
VITE_ENVIRONMENT=local
```
This is used when running the frontend locally with `npm run dev` and the backend running on localhost:4000.

### Docker Environment (`.env.docker`)
```bash
# Service 1: Main API for App/Dashboard components and Cards
VITE_API_URL=https://api.filmscout.app

# Service 2: News API for News page components
VITE_NEWS_API_URL=<GET_NEWS_URL>  # e.g. https://us-central1-your-project.cloudfunctions.net/getNews

# Environment identifier
VITE_ENVIRONMENT=docker
```
This is used when deploying to the Docker-hosted dev service.

### Production Environment (`.env.production`)
```bash
# Service 1: Main API for App/Dashboard components and Cards
VITE_API_URL=https://api.filmscout.app

# Service 2: News API for News page components
VITE_NEWS_API_URL=<GET_NEWS_URL>  # e.g. https://us-central1-your-project.cloudfunctions.net/getNews

# Environment identifier
VITE_ENVIRONMENT=production
```
This configuration should be set as environment variables in Vercel dashboard.

## How to Use Different Environments

### Local Development
1. Use the existing `.env` file (already configured)
2. Start backend: `cd backend && npm start`
3. Start frontend: `cd frontend && npm run dev`
4. Main API calls use `http://localhost:4000`, News calls use Google Cloud Function

### Docker Deployment (Optional)
1. Copy `.env.docker` to `.env` before building the Docker image:
   ```bash
   cp .env.docker .env
   ```
2. Build and deploy your Docker containers
3. Main API calls use `https://api.filmscout.app`, News calls use Google Cloud Function

### Vercel Production Deployment
1. Set environment variables in Vercel dashboard:
   - `VITE_API_URL=https://api.filmscout.app`
   - `VITE_NEWS_API_URL=<GET_NEWS_URL>  # e.g. https://us-central1-your-project.cloudfunctions.net/getNews`
   - `VITE_ENVIRONMENT=production`
2. Deploy to Vercel
3. Both services will use production URLs

## API Endpoint Configuration

The centralized API configuration is handled in `src/utils/apiConfig.js`. This file provides:

### Main API Service (App/Dashboard/Cards)
1. **Uses `VITE_API_URL` environment variable** (recommended)
2. **Falls back to hostname detection**:
   - `localhost` → `http://localhost:4000`
   - `scout-dev.asentic.co` → `https://api.filmscout.app`
   - Other domains → `https://api.filmscout.app`

### News API Service (News Page)
1. **Uses `VITE_NEWS_API_URL` environment variable**
2. **Falls back to Google Cloud Function URL**

## Available API Endpoints

### Main API Endpoints (from `apiConfig.js`)
- `API_ENDPOINTS.EVENTS`
- `API_ENDPOINTS.INFER_PRODUCTION`
- `API_ENDPOINTS.INFER_ACTORS`
- `API_ENDPOINTS.INFER_UNKNOWN`
- `API_ENDPOINTS.ACTOR_IMAGE`
- `API_ENDPOINTS.COMPANY_LOGO`
- `API_ENDPOINTS.PRODUCTION_TEASER`
- `API_ENDPOINTS.SUGGESTED_NEIGHBORHOODS`

### News API Endpoints (from `apiConfig.js`)
- `NEWS_API_ENDPOINTS.PRODUCTION_NEWS`
- `NEWS_API_ENDPOINTS.LOCATION_NEWS`
- `NEWS_API_ENDPOINTS.ALL_NEWS`

## Troubleshooting

If you see API calls going to the wrong URL:
1. Check your `.env` file has the correct `VITE_API_URL` and `VITE_NEWS_API_URL`
2. Restart the frontend development server after changing `.env`
3. Check browser network tab to verify API calls are going to the expected URLs
4. Make sure all client utilities are importing from `apiConfig.js`
5. Verify News components are using `newsService.js` which uses `VITE_NEWS_API_URL`
