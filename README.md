# FilmScout Frontend - React + Vite

A modern React application for film industry professionals, featuring AI-powered news generation with intelligent image selection and professional visual presentation.

## 🚀 Features

### Enhanced News Service
- **AI-Powered Content**: Gemini AI generates fresh, industry-relevant news
- **Smart Image Selection**: Contextual imagery for each news article
- **Professional Presentation**: Film industry-focused visual design
- **Intelligent Fallbacks**: Reliable content delivery with graceful degradation
- **Performance Optimized**: Lazy loading, caching, and error handling

### Visual Enhancements
- 🖼️ **Professional Imagery**: High-quality film industry photos
- 🎨 **AI Indicators**: Visual cues for generated content and images
- 📱 **Responsive Design**: Optimized for all device sizes
- ⚡ **Fast Loading**: Optimized images and performance features
- 🔄 **Smart Fallbacks**: Intelligent backup system for reliability

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Deploying to Vercel

This project is configured for seamless deployment on Vercel's platform. Follow these steps to deploy:

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Import your project to Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign up or log in
   - Click "Add New" > "Project"
   - Import your Git repository
   - Vercel will automatically detect it's a Vite project

3. **Configure your deployment**:
   - Framework Preset: Vite
   - Build Command: `npm run build` (already configured)
   - Output Directory: `dist` (already configured)

4. **Set up environment variables**:
   - Add the required environment variables in your Vercel project settings
   - At minimum, add `VITE_API_URL` pointing to your Google Cloud Function

5. **Deploy**:
   - Click "Deploy" and Vercel will build and deploy your application
   - Your site will be live at `https://your-project-name.vercel.app`

### Automatic Deployments

Once set up, Vercel will automatically deploy:
- When you push to your main branch
- For pull requests (preview deployments)

### Custom Domain

To use a custom domain:
1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add and configure your domain

### Environment Variables

Make sure to set these environment variables in your Vercel project settings:
- `VITE_API_URL`: URL to your backend API (Google Cloud Function)
- Any other variables needed by your application

## 🎨 Enhanced News Architecture

The application now features an enhanced news service with intelligent image selection:

- **GeminiNewsImageService**: AI-powered content and image generation
- **FallbackImageService**: Smart image fallback with keyword matching
- **Enhanced Cloud Functions**: Server-side image processing and optimization
- **Visual Indicators**: Clear marking of AI-generated content and images

For detailed implementation information, see:
- [`GEMINI_INTEGRATION.md`](src/GEMINI_INTEGRATION.md) - AI service overview
- [`ENHANCED_IMPLEMENTATION_GUIDE.md`](src/ENHANCED_IMPLEMENTATION_GUIDE.md) - Detailed implementation guide
- [`ARCHITECTURE.md`](src/ARCHITECTURE.md) - System architecture overview
