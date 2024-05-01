FROM node:20

# Set the working directory inside the container
WORKDIR /usr/src/app/webapp

COPY ./webapp/package*.json .

# Install dependencies
RUN npm install

# Copy the application code
COPY ./webapp .
COPY ./common ../common

RUN npm run build

EXPOSE 3001

# Define a command to run the application
CMD ["npm", "start"]
