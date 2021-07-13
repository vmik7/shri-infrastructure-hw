
FROM node:14.17

# Папка приложения
WORKDIR /app

# Установка зависимостей
COPY package*.json ./
RUN npm ci

# Копирование файлов проекта
COPY . .

# Запуск проекта
CMD ["npm", "start"]
