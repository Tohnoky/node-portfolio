#!/bin/sh
# Подставляем переменные окружения в конфиг
envsubst < /etc/alertmanager/alertmanager.yml.template > /etc/alertmanager/alertmanager.yml
# Запускаем оригинальный alertmanager
exec /bin/alertmanager "$@"
