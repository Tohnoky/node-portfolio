const express = require('express');
const redis = require('redis');
const { register, metricsMiddleware, updateVisitsMetric } = require('./metrics');

const app = express();
// Middleware для сбора метрик
app.use(metricsMiddleware);

const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || '1.0.0-local';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = process.env.REDIS_PORT || 6379;

// Создаём Redis клиент
const redisClient = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT
  }
});

// Обработка ошибок Redis
redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Подключаемся к Redis
(async () => {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis');
  } catch (err) {
    console.error('❌ Failed to connect to Redis:', err);
  }
})();

// Главная страница со счётчиком посещений
app.get('/', async (req, res) => {
  try {
    const visits = await redisClient.incr('visits');
    // Обновляем метрику visits
    await updateVisitsMetric(redisClient);
    res.send(`
      <h1>🚀 Hello from Node.js DevOps Portfolio!</h1>
      <p>Application Version: <strong>${VERSION}</strong></p>
      <p>Environment: <strong>${process.env.NODE_ENV || 'development'}</strong></p>
      <p>Total visits: <strong>${visits}</strong></p>
    `);
  } catch (err) {
    res.status(500).send('Error connecting to Redis');
  }
});

// Healthcheck
app.get('/healthz', async (req, res) => {
  try {
    if (redisClient.isOpen) {
      await redisClient.ping();
      res.status(200).send('OK');
    } else {
      res.status(503).send('Redis not connected');
    }
  } catch (err) {
    res.status(503).send('Service unavailable');
  }
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  try {
    // Обновляем метрику visits из Redis
    await updateVisitsMetric(redisClient);
    
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

// Версия
app.get('/version', (req, res) => {
  res.json({ 
    version: VERSION, 
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    redis: redisClient.isOpen ? 'connected' : 'disconnected'
  });
});

// Сброс счётчика (для тестов)
app.get('/reset', async (req, res) => {
  try {
    await redisClient.set('visits', 0);
    res.json({ message: 'Counter reset', visits: 0 });
  } catch (err) {
    res.status(500).send('Error resetting counter');
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
