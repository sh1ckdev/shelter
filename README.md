# Shelter Backend

Ветка `deploy/backend` содержит только серверную часть приложения. Код и зависимости расположены в корне репозитория.

## Старт локально

```bash
npm install
npm run dev
```

Перед запуском создайте файл `.env` (см. ниже).

## Docker

- `Dockerfile` — production-образ Node.js (работает через `npm ci --omit=dev`).
- `.dockerignore` — исключает кеши и служебные файлы.

Сборка и запуск:

```bash
docker build -t shelter-backend .
docker run --env-file .env -p 5000:5000 shelter-backend
```

## Переменные окружения (.env)

```
PORT=5000
DB_URL=mongodb://admin:adminpassword@mongo:27017/shelter?authSource=admin
JWT_ACCESS_SECRET=change_me_access
JWT_REFRESH_SECRET=change_me_refresh
CLIENT_ORIGIN=http://localhost:8080
```

При необходимости добавьте дополнительные переменные, которые используются в коде.

## Структура

- `controllers/`, `service/`, `middlewares/` — основной бизнес-код
- `static/` — загружаемые файлы (том пробрасывается в docker-compose)
- `index.js` — точка входа Express + MongoDB

Лишние фронтенд-файлы отсутствуют. Ветка готова для деплоя только backend-сервиса.

