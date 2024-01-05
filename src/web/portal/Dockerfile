# syntax=docker/dockerfile:1

ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine as build
WORKDIR /app
COPY . .
RUN npm install -g @angular/cli
RUN npm install

EXPOSE 80
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "80", "-c", "production"]
