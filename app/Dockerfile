# 1. Базовый образ - легковесный Node.js 20 на основе Alpine
FROM node:22-alpine

# 2. Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# 3. Копируем package.json и package-lock.json (если есть) отдельно
# Это позволяет Docker кэшировать установку зависимостей
COPY package*.json ./

# 4. Устанавливаем зависимости (только production, без devDependencies)
RUN npm ci --only=production

# 5. Копируем исходный код приложения
COPY . .

# 6. Создаём непривилегированного пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# 7. Меняем владельца файлов
RUN chown -R nodejs:nodejs /app
USER nodejs

# 8. Указываем порт, который будет слушать приложение
EXPOSE 3000

# 9. Healthcheck для проверки работоспособности контейнера
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/healthz', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# 10. Команда запуска приложения
CMD ["node", "index.js"]
