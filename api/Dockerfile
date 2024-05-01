FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app/api

COPY ./api/package*.json .

# Install dependencies
RUN npm install

# Copy the application code
COPY ./api .
COPY ./common ../common

RUN npm run build

EXPOSE 3001

# Define a command to run the application
CMD ["npm", "start"]
