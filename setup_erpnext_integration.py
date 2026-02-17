#!/usr/bin/env python3
"""
Script para configurar a integração entre Frappe CRM e ERPNext via API

Uso:
    # Via bench console no container do CRM
    bench --site crm.localhost console
    >>> exec(open('setup_erpnext_integration.py').read())
    
    # Ou diretamente
    bench --site crm.localhost execute setup_erpnext_integration.configure_integration
"""

import frappe
from frappe import _


def configure_integration(
    erpnext_url="http://localhost:8000",
    api_key=None,
    api_secret=None,
    company_name="Minha Empresa",
    auto_create_customer=True,
    deal_status="Won"
):
    """
    Configura a integração do CRM com ERPNext
    
    Args:
        erpnext_url (str): URL do site ERPNext
        api_key (str): API Key do ERPNext
        api_secret (str): API Secret do ERPNext
        company_name (str): Nome da empresa no ERPNext
        auto_create_customer (bool): Criar cliente automaticamente ao mudar status
        deal_status (str): Status do deal que dispara criação de cliente
    """
    
    print("\n" + "="*60)
    print("🔧 Configurando Integração Frappe CRM + ERPNext")
    print("="*60 + "\n")
    
    try:
        # Verificar se o status existe
        if auto_create_customer:
            if not frappe.db.exists("CRM Deal Status", deal_status):
                print(f"⚠️  Status '{deal_status}' não encontrado. Criando...")
                # Listar status disponíveis
                statuses = frappe.get_all("CRM Deal Status", fields=["name"])
                if statuses:
                    print(f"📋 Status disponíveis: {', '.join([s.name for s in statuses])}")
                    deal_status = statuses[0].name
                    print(f"✓ Usando status: {deal_status}")
        
        # Obter ou criar configuração
        doc = frappe.get_single("ERPNext CRM Settings")
        
        # Configurar campos
        doc.enabled = 1
        doc.is_erpnext_in_different_site = 1
        doc.erpnext_site_url = erpnext_url
        doc.erpnext_company = company_name
        
        if api_key:
            doc.api_key = api_key
        if api_secret:
            doc.api_secret = api_secret
            
        doc.create_customer_on_status_change = 1 if auto_create_customer else 0
        if auto_create_customer:
            doc.deal_status = deal_status
        
        # Salvar
        doc.save()
        frappe.db.commit()
        
        print("✅ Integração configurada com sucesso!\n")
        print("📋 Configurações:")
        print(f"   • ERPNext URL: {doc.erpnext_site_url}")
        print(f"   • Empresa: {doc.erpnext_company}")
        print(f"   • API Key: {'✓ Configurada' if doc.api_key else '✗ Não configurada'}")
        print(f"   • API Secret: {'✓ Configurada' if doc.api_secret else '✗ Não configurada'}")
        print(f"   • Auto-criar cliente: {'Sim' if doc.create_customer_on_status_change else 'Não'}")
        if doc.create_customer_on_status_change:
            print(f"   • Status gatilho: {doc.deal_status}")
        
        print("\n" + "="*60)
        print("🎯 Próximos passos:")
        print("="*60)
        if not api_key or not api_secret:
            print("\n1. Obter API Keys do ERPNext:")
            print(f"   Acesse: {erpnext_url}")
            print("   Vá em: Setup > Integrations > API Key")
            print("   Gere as credenciais e execute:")
            print("\n   >>> from setup_erpnext_integration import update_api_credentials")
            print("   >>> update_api_credentials('SUA_API_KEY', 'SUA_API_SECRET')")
        else:
            print("\n✓ Integração pronta para uso!")
            print("\n2. Testar conexão:")
            print("   >>> from setup_erpnext_integration import test_connection")
            print("   >>> test_connection()")
            print("\n3. Criar um teste:")
            print("   >>> from setup_erpnext_integration import create_test_customer")
            print("   >>> create_test_customer()")
        
        return doc
        
    except Exception as e:
        print(f"\n❌ Erro ao configurar integração: {str(e)}")
        frappe.log_error(frappe.get_traceback(), "Erro na configuração ERPNext")
        raise


def update_api_credentials(api_key, api_secret):
    """
    Atualiza as credenciais de API
    
    Args:
        api_key (str): API Key do ERPNext
        api_secret (str): API Secret do ERPNext
    """
    try:
        doc = frappe.get_single("ERPNext CRM Settings")
        doc.api_key = api_key
        doc.api_secret = api_secret
        doc.save()
        frappe.db.commit()
        
        print("✅ Credenciais de API atualizadas com sucesso!")
        print("\n🧪 Testar conexão:")
        print("   >>> from setup_erpnext_integration import test_connection")
        print("   >>> test_connection()")
        
    except Exception as e:
        print(f"❌ Erro ao atualizar credenciais: {str(e)}")
        raise


def test_connection():
    """
    Testa a conexão com o ERPNext
    """
    print("\n🔍 Testando conexão com ERPNext...\n")
    
    try:
        from frappe.frappeclient import FrappeClient
        
        settings = frappe.get_single("ERPNext CRM Settings")
        
        if not settings.enabled:
            print("❌ Integração não está habilitada")
            return False
        
        if not settings.api_key or not settings.api_secret:
            print("❌ API Key/Secret não configurados")
            return False
        
        # Criar cliente
        client = FrappeClient(
            settings.erpnext_site_url,
            api_key=settings.api_key,
            api_secret=settings.get_password("api_secret")
        )
        
        # Testar requisição
        print(f"📡 Conectando em: {settings.erpnext_site_url}...")
        companies = client.get_list("Company", fields=["name", "company_name"])
        
        print("✅ Conexão bem-sucedida!\n")
        print("🏢 Empresas encontradas:")
        for company in companies:
            print(f"   • {company.get('company_name')} ({company.get('name')})")
        
        # Verificar se a empresa configurada existe
        company_exists = any(c.get('name') == settings.erpnext_company for c in companies)
        if not company_exists:
            print(f"\n⚠️  Empresa '{settings.erpnext_company}' não encontrada no ERPNext")
            print("    Considere atualizar o nome da empresa na configuração")
        else:
            print(f"\n✅ Empresa '{settings.erpnext_company}' encontrada!")
        
        return True
        
    except Exception as e:
        print(f"❌ Erro na conexão: {str(e)}")
        print("\n🔧 Verifique:")
        print("   • URL do ERPNext está correta")
        print("   • API Key/Secret estão corretas")
        print("   • ERPNext está acessível")
        print("   • Firewall/rede permite a conexão")
        return False


def create_test_customer():
    """
    Cria um cliente de teste no ERPNext via API
    """
    print("\n🧪 Criando cliente de teste no ERPNext...\n")
    
    try:
        from frappe.frappeclient import FrappeClient
        import random
        
        settings = frappe.get_single("ERPNext CRM Settings")
        
        if not settings.enabled:
            print("❌ Integração não está habilitada")
            return
        
        client = FrappeClient(
            settings.erpnext_site_url,
            api_key=settings.api_key,
            api_secret=settings.get_password("api_secret")
        )
        
        # Gerar dados de teste
        test_id = random.randint(1000, 9999)
        customer_name = f"Cliente Teste {test_id}"
        
        customer_data = {
            "doctype": "Customer",
            "customer_name": customer_name,
            "customer_type": "Company",
            "customer_group": "Commercial",
            "territory": "All Territories"
        }
        
        print(f"📝 Criando: {customer_name}")
        result = client.insert(customer_data)
        
        print(f"✅ Cliente criado com sucesso!")
        print(f"   ID: {result.get('name')}")
        print(f"   Nome: {result.get('customer_name')}")
        print(f"\n🔗 Link: {settings.erpnext_site_url}/app/customer/{result.get('name')}")
        
        return result
        
    except Exception as e:
        print(f"❌ Erro ao criar cliente: {str(e)}")
        frappe.log_error(frappe.get_traceback(), "Erro ao criar cliente teste")
        raise


def show_current_config():
    """
    Mostra a configuração atual da integração
    """
    try:
        doc = frappe.get_single("ERPNext CRM Settings")
        
        print("\n" + "="*60)
        print("📋 Configuração Atual - ERPNext CRM Settings")
        print("="*60 + "\n")
        
        print(f"Status: {'✅ Habilitado' if doc.enabled else '❌ Desabilitado'}")
        print(f"Site diferente: {'Sim' if doc.is_erpnext_in_different_site else 'Não'}")
        print(f"URL ERPNext: {doc.erpnext_site_url or 'Não configurado'}")
        print(f"Empresa: {doc.erpnext_company or 'Não configurado'}")
        print(f"API Key: {'✓ Configurada' if doc.api_key else '✗ Não configurada'}")
        print(f"API Secret: {'✓ Configurada' if doc.api_secret else '✗ Não configurada'}")
        print(f"Auto-criar cliente: {'Sim' if doc.create_customer_on_status_change else 'Não'}")
        if doc.create_customer_on_status_change:
            print(f"Status gatilho: {doc.deal_status}")
        
        print("\n" + "="*60 + "\n")
        
    except Exception as e:
        print(f"❌ Erro: {str(e)}")


# Exemplo de uso interativo
if __name__ == "__main__":
    print("""
╔════════════════════════════════════════════════════════════╗
║     Configurador de Integração Frappe CRM + ERPNext       ║
╚════════════════════════════════════════════════════════════╝

Este script deve ser executado dentro do Frappe Bench:

1. Acesse o container do CRM:
   docker exec -it crm-frappe-1 bash

2. Execute o console do Frappe:
   cd frappe-bench
   bench --site crm.localhost console

3. Execute as funções:
   
   # Ver configuração atual
   >>> exec(open('/workspace/setup_erpnext_integration.py').read())
   >>> show_current_config()
   
   # Configurar integração
   >>> configure_integration(
   ...     erpnext_url="http://localhost:8000",
   ...     company_name="Minha Empresa"
   ... )
   
   # Atualizar API Keys (obtenha no ERPNext primeiro)
   >>> update_api_credentials("sua_api_key", "sua_api_secret")
   
   # Testar conexão
   >>> test_connection()
   
   # Criar cliente de teste
   >>> create_test_customer()

Para mais informações, consulte: INTEGRACAO_ERPNEXT.md
""")
