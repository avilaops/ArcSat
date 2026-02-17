#!/bin/bash

# Script de instalação da integração CNPJ/CPF
# Execute dentro do container do Frappe

echo "================================================"
echo "Instalação Integração CNPJ/CPF - Brasil"
echo "================================================"
echo ""

# Verifica se está no diretório correto
if [ ! -d "frappe-bench" ]; then
    echo "❌ Erro: Execute este script no diretório /home/frappe/"
    exit 1
fi

cd frappe-bench

echo "📋 Passo 1: Criando campos customizados..."
bench --site crm.localhost execute crm.patches.adicionar_campos_cnpj_cpf.execute

if [ $? -eq 0 ]; then
    echo "✅ Campos customizados criados com sucesso!"
else
    echo "❌ Erro ao criar campos customizados"
    exit 1
fi

echo ""
echo "🧹 Passo 2: Limpando cache..."
bench --site crm.localhost clear-cache

if [ $? -eq 0 ]; then
    echo "✅ Cache limpo com sucesso!"
else
    echo "❌ Erro ao limpar cache"
    exit 1
fi

echo ""
echo "🔄 Passo 3: Instalando dependência requests (se necessário)..."
pip install requests
echo "✅ Dependências verificadas!"

echo ""
echo "================================================"
echo "✅ Instalação concluída com sucesso!"
echo "================================================"
echo ""
echo "📌 Próximos passos:"
echo ""
echo "1. Reinicie o container:"
echo "   docker restart crm-frappe-1"
echo ""
echo "2. Acesse ERPNext e teste:"
echo "   http://localhost:8080/app/customer"
echo ""
echo "3. Crie um novo cliente e selecione 'CNPJ'"
echo ""
echo "4. Digite um CNPJ válido e veja a mágica! ✨"
echo ""
echo "📖 Documentação completa: INTEGRACAO_CNPJ_CPF.md"
echo ""
