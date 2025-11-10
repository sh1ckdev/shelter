# Этап сборки
FROM node:20-alpine AS build

WORKDIR /app

ENV NODE_ENV=production
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Этап запуска (без nginx)
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

# Установим лёгкий сервер для статики
RUN npm install -g serve

# Копируем собранный фронт
COPY --from=build /app/dist ./dist

# Слушаем на всех интерфейсах
E
