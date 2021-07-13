FROM node:14-alpine
WORKDIR /app

RUN apk add --update --no-cache bash tzdata curl make gcc g++ python git tzdata nginx unzip openjdk8 && \
  rm -rf /tmp/* /var/cache/apk/*

# RUN adduser -D agent && chown -R agent /app

COPY package*.json ./
COPY . .

RUN npm ci
CMD node index.js
