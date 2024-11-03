# Use a base puppeteer image
FROM ghcr.io/puppeteer/puppeteer:latest

# Set the working directory in the container
WORKDIR /usr/src/app/ccv

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
