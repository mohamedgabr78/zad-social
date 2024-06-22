# Use the official Node.js image as the base image
FROM node:20

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies including mongoose and redis
RUN npm install mongoose redis

# Copy the backend and frontend directories
COPY ./backend ./backend
COPY ./frontend ./frontend

# Copy the .env file to the working directory
COPY .env ./

# Install frontend dependencies and build the frontend (if applicable)
RUN npm install --prefix frontend
RUN npm run build --prefix frontend

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["node", "./backend/server.js"]
