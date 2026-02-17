# Dockerfile para deploy do ArcSat CRM no Render
FROM frappe/bench:latest

USER root

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    git \
    mariadb-client \
    && rm -rf /var/lib/apt/lists/*

USER frappe
WORKDIR /home/frappe

# Copiar código do ArcSat CRM
COPY --chown=frappe:frappe ./crm /tmp/arcsat-crm

# Copiar script de inicialização
COPY --chown=frappe:frappe ./docker/init-render.sh /home/frappe/init-render.sh
RUN chmod +x /home/frappe/init-render.sh

# Expor portas
EXPOSE 8000 9000

# Comando padrão
CMD ["/home/frappe/init-render.sh"]
