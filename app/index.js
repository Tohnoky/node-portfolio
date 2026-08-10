const express = require('express');
const app = express();

// Порт и версия берём из переменных окружения, если они есть, иначе используем дефолтные
const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || '1.0.0-local';

// Главная страница
app.get('/', (req, res) => {
  res.send(`
    <h1>🚀 Hello from Node.js DevOps Portfolio!</h1>
    <p>Application Version: <strong>${VERSION}</strong></p>
    <p>Environment: <strong>${process.env.NODE_ENV || 'development'}</strong></p>
  `);
});

// Healthcheck (проверка здоровья) - нужна для Docker и CI/CD
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Эндпоинт с версией в формате JSON
app.get('/version', (req, res) => {
  res.json({ 
    version: VERSION, 
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
