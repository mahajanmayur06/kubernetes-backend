# Use the official Node.js image from Docker Hub
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on (defined in .env or default 5000)
EXPOSE ${PORT}

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "server.js"]