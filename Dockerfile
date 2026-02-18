# Dockerfile para deploy do ArcSat CRM no Render
# Build completo durante a imagem - Deploy mais rápido e leve no Render
FROM frappe/bench:latest

USER root

# Instalar dependências do sistema (PostgreSQL e MariaDB clients)
RUN apt-get update && apt-get install -y \
    git \
    postgresql-client \
    mariadb-client \
    redis-tools \
    && rm -rf /var/lib/apt/lists/*

USER frappe
WORKDIR /home/frappe

# Criar bench com Frappe Framework (BUILD TIME)
RUN bench init --skip-redis-config-generation frappe-bench \
    --version version-15 \
    --python python3.11 \
    && cd frappe-bench \
    && sed -i '/redis/d' ./Procfile \
    && sed -i '/watch/d' ./Procfile

WORKDIR /home/frappe/frappe-bench

# Copiar e instalar ArcSat CRM app (BUILD TIME)
COPY --chown=frappe:frappe ./crm ./apps/crm
RUN bench get-app --skip-assets crm file:///home/frappe/frappe-bench/apps/crm

# Build dos assets (BUILD TIME - pesado, mas s\u00f3 uma vez)
RUN bench build --apps frappe,crm

# Copiar script de inicializa\u00e7\u00e3o simplificado
COPY --chown=frappe:frappe ./docker/init-render.sh /home/frappe/frappe-bench/init-render.sh
RUN chmod +x /home/frappe/frappe-bench/init-render.sh

# Expor portas
EXPOSE 8000 9000

# Comando padr\u00e3o
CMD ["/home/frappe/frappe-bench/init-render.sh"]
