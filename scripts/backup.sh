#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$HOME/projects/node-portfolio/app"
BACKUP_DIR="$HOME/projects/node-portfolio/backups"

# Создаём директорию для бэкапов, если её нет (флаг -p спасёт от ошибки, если она уже есть)
mkdir -p "${BACKUP_DIR}"

# Формируем дату: 2026-08-10_15-30-00
DATE=$(date '+%Y-%m-%d_%H-%M-%S')
BACKUP_FILE="${BACKUP_DIR}/app_backup_${DATE}.tar.gz"

echo "Создаём архив ${BACKUP_FILE}..."

# tar -c (create) -z (gzip) -f (file)
tar -czf "${BACKUP_FILE}" -C "$(dirname "${PROJECT_DIR}")" "$(basename "${PROJECT_DIR}")"

echo "✅ Бэкап успешно создан: ${BACKUP_FILE}"
