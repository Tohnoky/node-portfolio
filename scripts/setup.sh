#!/usr/bin/env bash
set -euo pipefail

log_info() { echo "[INFO] $1"; }
log_error() { echo "[ERROR] $1" >&2; }

log_info "Начинаем проверку окружения для node-portfolio..."

# Массив нужных программ
REQUIRED_TOOLS=("git" "node" "npm" "docker" "docker compose")

for TOOL in "${REQUIRED_TOOLS[@]}"; do
    # command -v проверяет, существует ли команда в системе
    if command -v "${TOOL}" > /dev/null 2>&1; then
        log_info "✅ ${TOOL} установлен."
    else
        log_error "❌ ${TOOL} НЕ установлен! Установи его перед продолжением."
        exit 1
    fi
done

log_info "Окружение готово к работе!"
