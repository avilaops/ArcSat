#!/bin/bash

set -e

# Aguardar serviços estarem prontos
echo "Aguardando PostgreSQL estar pronto..."
export PGPASSWORD="${DB_PASSWORD}"
while ! pg_isready -h "${DB_HOST}" -p "${DB_PORT:-5432}" -U "${DB_USER}" > /dev/null 2>&1; do
    echo "Esperando PostgreSQL responder..."
    sleep 2
done
unset PGPASSWORD

echo "PostgreSQL está pronto!"

echo "Aguardando Redis estar pronto..."
while ! redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT:-6379}" ping > /dev/null 2>&1; do
    echo "Esperando Redis responder..."
    sleep 1
done

echo "Redis está pronto!"

# Usar bench que já vem pronto na imagem Docker
echo "Usando bench pré-configurado da imagem..."
cd /home/frappe/frappe-bench

# Configurar conexões com PostgreSQL e Redis dinamicamente
echo "Configurando conexão com PostgreSQL..."
bench set-config db_host "${DB_HOST}"
bench set-config db_port "${DB_PORT:-5432}"
bench set-config db_type "postgres"

echo "Configurando conexão com Redis..."
bench set-redis-cache-host "redis://${REDIS_HOST}:${REDIS_PORT:-6379}"
bench set-redis-queue-host "redis://${REDIS_HOST}:${REDIS_PORT:-6379}"
bench set-redis-socketio-host "redis://${REDIS_HOST}:${REDIS_PORT:-6379}"

# Verificar se site já existe
SITE_NAME="${SITE_NAME:-crm.localhost}"

if [ ! -d "/home/frappe/frappe-bench/sites/${SITE_NAME}" ]; then
    echo "Criando novo site: ${SITE_NAME}"
    
    # Para PostgreSQL, usar opções diferentes
    if [ "${DB_TYPE}" = "postgres" ]; then
        bench new-site "${SITE_NAME}" \
            --force \
            --db-type postgres \
            --db-host "${DB_HOST}" \
            --db-port "${DB_PORT:-5432}" \
            --db-name "${DB_NAME}" \
            --db-user "${DB_USER}" \
            --db-password "${DB_PASSWORD}" \
            --admin-password "${ADMIN_PASSWORD:-admin}"
    else
        # Fallback para MariaDB/MySQL
        bench new-site "${SITE_NAME}" \
            --force \
            --mariadb-root-password "${DB_PASSWORD}" \
            --admin-password "${ADMIN_PASSWORD:-admin}" \
            --no-mariadb-socket
    fi
    
    echo "Instalando ArcSat CRM no site..."
    bench --site "${SITE_NAME}" install-app crm
    
    # Configurações do site
    bench --site "${SITE_NAME}" set-config mute_emails 0
    bench --site "${SITE_NAME}" set-config server_script_enabled 1
    
    # Adicionar MongoDB URI se disponível (para integrações futuras)
    if [ ! -z "${MONGO_ATLAS_URI}" ]; then
        bench --site "${SITE_NAME}" set-config mongo_uri "${MONGO_ATLAS_URI}"
        echo "MongoDB Atlas URI configurado para integrações"
    fi
    
    bench use "${SITE_NAME}"
else
    echo "Site ${SITE_NAME} já existe, executando migrações..."
    bench --site "${SITE_NAME}" migrate
    bench use "${SITE_NAME}"
fi

# Limpar cache
bench --site "${SITE_NAME}" clear-cache

echo "===================================="
echo "ArcSat CRM Pronto!"
echo "Site: ${SITE_NAME}"
echo "Banco: PostgreSQL (${DB_HOST})"
echo "Cache: Redis (${REDIS_HOST})"
if [ ! -z "${MONGO_ATLAS_URI}" ]; then
    echo "MongoDB: Configurado para integrações"
fi
echo "===================================="

echo "Iniciando servidor..."
# Usar 0.0.0.0 para aceitar conexões externas
bench serve --port 8000 --host 0.0.0.0
