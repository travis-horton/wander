# The version of Node to use
FROM node:13.12.0-alpine

# The path to application within the container. Making web directory as the work directory
WORKDIR /web

# Copies package.json to the Docker environment.
COPY ./package.json /web/package.json

# Installs all node packages
RUN npm install

# Copies the code to the web directory in the Docker container
COPY . /web/

# Port to be exposed
EXPOSE 80

CMD ["npm", "start"]
