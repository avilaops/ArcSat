#!/bin/bash

set -e

# Aguardar serviços estarem prontos
echo "Aguardando MariaDB estar pronto..."
while ! mysqladmin ping -h"${MARIADB_HOST}" -P"${MARIADB_PORT:-3306}" --silent; do
    sleep 1
done

echo "Aguardando Redis estar pronto..."
while ! redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT:-6379}" ping > /dev/null 2>&1; do
    sleep 1
done

# Verificar se bench já existe
if [ -d "/home/frappe/frappe-bench/apps/frappe" ]; then
    echo "Bench já existe, usando existente..."
    cd frappe-bench
else
    echo "Criando novo bench..."
    bench init --skip-redis-config-generation frappe-bench --version version-15 --python python3.11
    cd frappe-bench
    
    # Configurar conexões com serviços externos
    bench set-mariadb-host "${MARIADB_HOST}"
    bench set-redis-cache-host "redis://${REDIS_HOST}:${REDIS_PORT:-6379}"
    bench set-redis-queue-host "redis://${REDIS_HOST}:${REDIS_PORT:-6379}"
    bench set-redis-socketio-host "redis://${REDIS_HOST}:${REDIS_PORT:-6379}"
    
    # Remover redis e watch do Procfile (usaremos serviços externos)
    sed -i '/redis/d' ./Procfile
    sed -i '/watch/d' ./Procfile
    
    # Copiar código do ArcSat CRM
    echo "Instalando ArcSat CRM..."
    cp -r /tmp/arcsat-crm ./apps/crm
    bench --site all install-app crm || true
fi

# Verificar se site já existe
SITE_NAME="${SITE_NAME:-crm.localhost}"

if [ ! -d "/home/frappe/frappe-bench/sites/${SITE_NAME}" ]; then
    echo "Criando novo site: ${SITE_NAME}"
    bench new-site "${SITE_NAME}" \
        --force \
        --mariadb-root-password "${MARIADB_ROOT_PASSWORD}" \
        --admin-password "${ADMIN_PASSWORD:-admin}" \
        --no-mariadb-socket
    
    echo "Instalando ArcSat CRM no site..."
    bench --site "${SITE_NAME}" install-app crm
    
    # Configurações do site
    bench --site "${SITE_NAME}" set-config mute_emails 0
    bench --site "${SITE_NAME}" set-config server_script_enabled 1
    bench use "${SITE_NAME}"
else
    echo "Site ${SITE_NAME} já existe, executando migrações..."
    bench --site "${SITE_NAME}" migrate
    bench use "${SITE_NAME}"
fi

# Limpar cache
bench --site "${SITE_NAME}" clear-cache

echo "Iniciando servidor..."
# Usar 0.0.0.0 para aceitar conexões externas
bench serve --port 8000 --host 0.0.0.0
