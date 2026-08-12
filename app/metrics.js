const client = require('prom-client');

// Создаём реестр метрик
const register = new client.Registry();

// Добавляем стандартные метрики Node.js (CPU, память, GC)
client.collectDefaultMetrics({ register });

// Кастомная метрика: общее количество HTTP-запросов
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Кастомная метрика: длительность HTTP-запросов
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
  registers: [register]
});

// Кастомная метрика: количество посещений (из Redis)
const visitsTotal = new client.Gauge({
  name: 'visits_total',
  help: 'Total number of visits from Redis counter',
  registers: [register]
});

// Middleware для сбора метрик HTTP-запросов
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestsTotal.inc({
      method: req.method,
      route: route,
      status_code: res.statusCode
    });
    
    httpRequestDuration.observe({
      method: req.method,
      route: route,
      status_code: res.statusCode
    }, duration);
  });
  
  next();
};

// Функция для обновления метрики visits из Redis
const updateVisitsMetric = async (redisClient) => {
  try {
    if (redisClient.isOpen) {
      const visits = await redisClient.get('visits');
      if (visits) {
        visitsTotal.set(parseInt(visits, 10));
      }
    }
  } catch (err) {
    console.error('Failed to update visits metric:', err);
  }
};

module.exports = {
  register,
  metricsMiddleware,
  updateVisitsMetric
};
