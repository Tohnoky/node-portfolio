#!/usr/bin/env bash
set -euo pipefail

PORT_TO_CHECK="${1:-80}" # Берём первый аргумент, если его нет - используем 80

echo "Проверяем демон Docker..."
if systemctl is-active --quiet docker; then
    echo "✅ Docker запущен."
else
    echo "❌ Docker не запущен!"
    exit 1
fi

echo "Проверяем, слушает ли кто-то порт ${PORT_TO_CHECK}..."
# ss -tulpn выводит порты. grep ищет нужный порт. wc -l считает строки.
if sudo ss -tulpn | grep -q ":${PORT_TO_CHECK} "; then
    echo "✅ Порт ${PORT_TO_CHECK} открыт и слушается."
else
    echo "⚠️ Порт ${PORT_TO_CHECK} сейчас никто не слушает (это нормально, если приложение не запущено)."
fi
