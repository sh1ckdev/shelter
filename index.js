require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const router = require('./routes/index')
const errorMiddleware = require('./middlewares/error-middleware')
const path = require('path');
const newsRouter = require('./routes/news.routes')
const PORT = process.env.PORT;
const app = express();

const parseOrigins = (value = '') =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:8080',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:8080',
];

const allowedOrigins = [
  ...defaultOrigins,
  ...parseOrigins(process.env.CLIENT_ORIGIN),
].filter((value, index, array) => array.indexOf(value) === index);

const staticPath = path.join(__dirname, 'static');
app.use(express.static(staticPath));

const getStatusColor = (statusCode) => {
  if (statusCode < 200) return '\x1b[90m'; 
  if (statusCode < 300) return '\x1b[32m'; 
  if (statusCode < 400) return '\x1b[36m'; 
  if (statusCode < 500) return '\x1b[33m'; 
  return '\x1b[31m';
};

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);
    const resetColor = '\x1b[0m';
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${statusColor}${res.statusCode}${resetColor} ${duration}ms`
    );
  });
  next();
});


app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(`Origin ${origin} is not allowed by CORS configuration.`)
      );
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api', router)
app.use('/news', newsRouter)
app.use(errorMiddleware)

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    
    const server = app.listen(PORT, () => {
      console.log(`Сервер запущен на порте ${PORT}`);
    });

    // Обработчики для корректного завершения
    process.on('SIGINT', () => {
      console.log('Получен SIGINT. Завершение работы...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('Сервер и подключение к MongoDB закрыты');
          process.exit(0);
        });
      });
    });

    process.on('SIGTERM', () => {
      console.log('Получен SIGTERM. Завершение работы...');
      server.close(() => {
        mongoose.connection.close(false, () => {
          console.log('Сервер и подключение к MongoDB закрыты');
          process.exit(0);
        });
      });
    });

  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}

start();