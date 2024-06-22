# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json .

# Install dependencies
RUN npm install && npm install typescript -g


# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# #run database migrations
# RUN npm run migrate_up

# # Command to run the application
# CMD ["node", "./src/server.js"]

# build the typescript -> javscript
RUN tsc

# CMD ["sh", "-c", "npm run migrate_up && npm run dev"]
# CMD ["sh", "-c", "npm run dev"]
CMD ["sh", "-c", "npm run dev"]
