# -*- coding: utf-8 -*-
"""
Script de instalação rápida da integração CNPJ/CPF
Execute via bench console:

bench --site crm.localhost console

>>> from crm.install_cnpj_cpf_integration import instalar
>>> instalar()
"""

import frappe


def instalar():
	"""
	Instala a integração CNPJ/CPF completa
	"""
	print("\n" + "="*60)
	print("INSTALAÇÃO INTEGRAÇÃO CNPJ/CPF - BRASIL")
	print("="*60 + "\n")
	
	try:
		# 1. Criar campos customizados
		print("📋 Passo 1: Criando campos customizados...")
		from crm.patches.adicionar_campos_cnpj_cpf import execute
		execute()
		print("✅ Campos customizados criados!\n")
		
		# 2. Limpar cache
		print("🧹 Passo 2: Limpando cache...")
		frappe.clear_cache()
		print("✅ Cache limpo!\n")
		
		# 3. Verificar dependências
		print("🔍 Passo 3: Verificando dependências...")
		try:
			import requests
			print(f"✅ requests instalado (versão {requests.__version__})\n")
		except ImportError:
			print("⚠️  Módulo 'requests' não encontrado")
			print("   Execute: pip install requests\n")
		
		# 4. Commit
		frappe.db.commit()
		
		print("="*60)
		print("✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!")
		print("="*60 + "\n")
		
		print("📌 Próximos passos:\n")
		print("1. Saia do console (Ctrl+D)")
		print("2. Reinicie o servidor:")
		print("   bench restart")
		print("   ou")
		print("   docker restart crm-frappe-1\n")
		print("3. Acesse um formulário de Cliente ou Fornecedor")
		print("4. Digite um CNPJ válido e veja a mágica! ✨\n")
		print("📖 Documentação: INTEGRACAO_CNPJ_CPF.md\n")
		
		return True
		
	except Exception as e:
		print(f"\n❌ Erro durante instalação: {str(e)}")
		frappe.log_error(frappe.get_traceback(), "Erro Instalação CNPJ/CPF")
		return False


def desinstalar():
	"""
	Remove a integração CNPJ/CPF
	"""
	print("\n" + "="*60)
	print("DESINSTALAÇÃO INTEGRAÇÃO CNPJ/CPF")
	print("="*60 + "\n")
	
	try:
		from crm.patches.adicionar_campos_cnpj_cpf import remover_campos_customizados
		
		print("🗑️  Removendo campos customizados...")
		remover_campos_customizados()
		print("✅ Campos removidos!\n")
		
		print("🧹 Limpando cache...")
		frappe.clear_cache()
		print("✅ Cache limpo!\n")
		
		frappe.db.commit()
		
		print("="*60)
		print("✅ DESINSTALAÇÃO CONCLUÍDA!")
		print("="*60 + "\n")
		
		print("🔄 Reinicie o servidor para aplicar as mudanças.\n")
		
		return True
		
	except Exception as e:
		print(f"\n❌ Erro durante desinstalação: {str(e)}")
		frappe.log_error(frappe.get_traceback(), "Erro Desinstalação CNPJ/CPF")
		return False


def testar():
	"""
	Testa a instalação e funcionalidades
	"""
	print("\n" + "="*60)
	print("TESTE DA INTEGRAÇÃO CNPJ/CPF")
	print("="*60 + "\n")
	
	# 1. Verificar campos customizados
	print("🔍 1. Verificando campos customizados...")
	campos_obrigatorios = ['cnpj', 'cpf', 'razao_social', 'nome_fantasia']
	
	for doctype in ['Customer', 'Supplier']:
		print(f"\n   {doctype}:")
		for campo in campos_obrigatorios:
			field_name = f'{doctype}-{campo}'
			exists = frappe.db.exists('Custom Field', field_name)
			status = "✅" if exists else "❌"
			print(f"   {status} {campo}")
	
	# 2. Testar API
	print("\n🔍 2. Testando API Brasil...")
	try:
		from crm.api.brasil_api import validar_cnpj, validar_cpf
		
		# Testar CNPJ válido
		cnpj_teste = "00000000000191"  # CNPJ de teste da Receita
		valido = validar_cnpj(cnpj_teste)
		print(f"   {'✅' if valido else '❌'} Validação CNPJ: {cnpj_teste}")
		
		# Testar CPF válido
		cpf_teste = "11144477735"  # CPF de teste
		valido = validar_cpf(cpf_teste)
		print(f"   {'✅' if valido else '❌'} Validação CPF: {cpf_teste}")
		
	except Exception as e:
		print(f"   ❌ Erro ao testar API: {str(e)}")
	
	# 3. Verificar módulo requests
	print("\n🔍 3. Verificando dependências...")
	try:
		import requests
		print(f"   ✅ requests {requests.__version__}")
		
		# Testar conectividade Brasil API
		print("\n   Testando conectividade Brasil API...")
		response = requests.get("https://brasilapi.com.br/api/cep/v2/01310100", timeout=5)
		if response.status_code == 200:
			print("   ✅ Brasil API respondendo normalmente")
		else:
			print(f"   ⚠️  Brasil API retornou status {response.status_code}")
			
	except ImportError:
		print("   ❌ requests não instalado")
	except Exception as e:
		print(f"   ⚠️  Erro ao testar conectividade: {str(e)}")
	
	print("\n" + "="*60)
	print("TESTE CONCLUÍDO")
	print("="*60 + "\n")


if __name__ == '__main__':
	instalar()
