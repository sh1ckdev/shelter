# Этап сборки
FROM node:20-alpine AS build

WORKDIR /app
ENV NODE_ENV=production

# Пробрасываем API URL
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

# Устанавливаем простой сервер для отдачи статики
RUN npm install -g serve

# Копируем собранный фронт
COPY --from=build /app/dist ./dist

# Открываем порт
EXPOSE 8080

# Слушаем на всех интерфейсах
CMD ["serve", "-s", "dist", "-l", "0.0.0.0:8080"]
