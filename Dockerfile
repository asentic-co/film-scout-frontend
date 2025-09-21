# Use a stable Node version
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Install dependencies first for caching
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the Vite dev server port
EXPOSE 5173

# Start the dev server with host enabled
CMD ["npm", "run", "dev", "--", "--host"]

# Reset the entrypoint to default
ENTRYPOINT []
