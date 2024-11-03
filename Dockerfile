# Use an official Node.js runtime as a base image
FROM node:20.10.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Expose the port your app runs on
EXPOSE 12024

# Command to run your application
CMD ["node", "index.js"]
