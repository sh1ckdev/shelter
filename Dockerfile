# Этап сборки
FROM node:20-alpine AS build

WORKDIR /app
ENV NODE_ENV=development

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm ci  # ставим всё, включая dev-зависимости
COPY . .
RUN npm run build

# Этап запуска
FROM node:20-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production

RUN npm install -g serve

COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "0.0.0.0:8080"]
