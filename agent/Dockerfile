FROM node:14.17-alpine

# Рабочая папка
WORKDIR /app

# Дополнительные пакеты для alpine
RUN apk add --update --no-cache bash tzdata curl make gcc g++ python git nginx unzip openjdk8 && \
  rm -rf /tmp/* /var/cache/apk/*

# Установка зависимостей
COPY package*.json ./
RUN npm ci

# Копирование файлов проекта
COPY . .

# Запуск проекта
CMD ["npm", "start"]
