# -*- coding: utf-8 -*-
# Copyright (c) 2024, Avx Technologies and contributors
# For license information, please see license.txt

"""
API para consulta de CNPJ/CPF na Receita Federal
Usa a Brasil API (https://brasilapi.com.br/) que é gratuita e open source
"""

import frappe
import requests
from frappe import _


@frappe.whitelist()
def buscar_dados_cnpj(cnpj):
	"""
	Busca dados de uma empresa na Receita Federal pelo CNPJ
	
	Args:
		cnpj (str): CNPJ da empresa (com ou sem formatação)
		
	Returns:
		dict: Dados da empresa ou erro
	"""
	try:
		# Limpar CNPJ (remover pontos, barras e traços)
		cnpj_limpo = ''.join(filter(str.isdigit, cnpj))
		
		# Validar tamanho
		if len(cnpj_limpo) != 14:
			return {
				"success": False,
				"message": _("CNPJ deve conter 14 dígitos")
			}
		
		# Validar CNPJ
		if not validar_cnpj(cnpj_limpo):
			return {
				"success": False,
				"message": _("CNPJ inválido")
			}
		
		# Consultar Brasil API
		url = f"https://brasilapi.com.br/api/cnpj/v1/{cnpj_limpo}"
		
		response = requests.get(url, timeout=10)
		
		if response.status_code == 200:
			dados = response.json()
			
			# Mapear dados para campos do ArcSat
			resultado = {
				"success": True,
				"data": {
					"customer_name": dados.get("razao_social") or dados.get("nome_fantasia"),
					"customer_type": "Company",
					"tax_id": formatar_cnpj(cnpj_limpo),
					"razao_social": dados.get("razao_social"),
					"nome_fantasia": dados.get("nome_fantasia"),
					"cnpj": formatar_cnpj(cnpj_limpo),
					"inscricao_estadual": dados.get("inscricao_estadual"),
					"natureza_juridica": dados.get("natureza_juridica"),
					"porte": dados.get("porte"),
					"capital_social": dados.get("capital_social"),
					"situacao_cadastral": dados.get("descricao_situacao_cadastral"),
					"data_inicio_atividade": dados.get("data_inicio_atividade"),
					"cnae_fiscal": dados.get("cnae_fiscal"),
					"cnae_fiscal_descricao": dados.get("cnae_fiscal_descricao"),
					"email": dados.get("email"),
					"telefone": formatar_telefone(dados.get("ddd_telefone_1")),
					"endereco": {
						"address_line1": f"{dados.get('logradouro', '')}, {dados.get('numero', 'S/N')}",
						"address_line2": dados.get("complemento", ""),
						"city": dados.get("municipio", ""),
						"state": dados.get("uf", ""),
						"pincode": dados.get("cep", "").replace(".", ""),
						"country": "Brazil",
						"bairro": dados.get("bairro", "")
					}
				}
			}
			
			return resultado
			
		elif response.status_code == 404:
			return {
				"success": False,
				"message": _("CNPJ não encontrado na Receita Federal")
			}
		else:
			return {
				"success": False,
				"message": _("Erro ao consultar CNPJ. Tente novamente mais tarde.")
			}
			
	except requests.exceptions.Timeout:
		frappe.log_error("Timeout ao consultar Brasil API", "Buscar CNPJ")
		return {
			"success": False,
			"message": _("Tempo de consulta excedido. Tente novamente.")
		}
		
	except Exception as e:
		frappe.log_error(frappe.get_traceback(), "Erro ao buscar CNPJ")
		return {
			"success": False,
			"message": _("Erro ao consultar CNPJ: {0}").format(str(e))
		}


@frappe.whitelist()
def validar_cpf_cnpj(documento):
	"""
	Valida CPF ou CNPJ
	
	Args:
		documento (str): CPF ou CNPJ (com ou sem formatação)
		
	Returns:
		dict: Resultado da validação
	"""
	doc_limpo = ''.join(filter(str.isdigit, documento))
	
	if len(doc_limpo) == 11:
		valido = validar_cpf(doc_limpo)
		tipo = "CPF"
	elif len(doc_limpo) == 14:
		valido = validar_cnpj(doc_limpo)
		tipo = "CNPJ"
	else:
		return {
			"success": False,
			"message": _("Documento deve conter 11 dígitos (CPF) ou 14 dígitos (CNPJ)")
		}
	
	return {
		"success": valido,
		"tipo": tipo,
		"message": _("{0} válido").format(tipo) if valido else _("{0} inválido").format(tipo)
	}


def validar_cnpj(cnpj):
	"""
	Valida CNPJ usando algoritmo oficial
	"""
	if len(cnpj) != 14:
		return False
	
	# Verifica se todos os dígitos são iguais
	if cnpj == cnpj[0] * 14:
		return False
	
	# Valida primeiro dígito verificador
	soma = 0
	peso = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
	for i in range(12):
		soma += int(cnpj[i]) * peso[i]
	
	digito1 = 11 - (soma % 11)
	if digito1 >= 10:
		digito1 = 0
	
	if int(cnpj[12]) != digito1:
		return False
	
	# Valida segundo dígito verificador
	soma = 0
	peso = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
	for i in range(13):
		soma += int(cnpj[i]) * peso[i]
	
	digito2 = 11 - (soma % 11)
	if digito2 >= 10:
		digito2 = 0
	
	return int(cnpj[13]) == digito2


def validar_cpf(cpf):
	"""
	Valida CPF usando algoritmo oficial
	"""
	if len(cpf) != 11:
		return False
	
	# Verifica se todos os dígitos são iguais
	if cpf == cpf[0] * 11:
		return False
	
	# Valida primeiro dígito verificador
	soma = 0
	for i in range(9):
		soma += int(cpf[i]) * (10 - i)
	
	digito1 = 11 - (soma % 11)
	if digito1 >= 10:
		digito1 = 0
	
	if int(cpf[9]) != digito1:
		return False
	
	# Valida segundo dígito verificador
	soma = 0
	for i in range(10):
		soma += int(cpf[i]) * (11 - i)
	
	digito2 = 11 - (soma % 11)
	if digito2 >= 10:
		digito2 = 0
	
	return int(cpf[10]) == digito2


def formatar_cnpj(cnpj):
	"""
	Formata CNPJ: 12.345.678/0001-90
	"""
	if len(cnpj) != 14:
		return cnpj
	
	return f"{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}"


def formatar_cpf(cpf):
	"""
	Formata CPF: 123.456.789-01
	"""
	if len(cpf) != 11:
		return cpf
	
	return f"{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}"


def formatar_telefone(telefone):
	"""
	Formata telefone brasileiro
	"""
	if not telefone:
		return ""
	
	tel_limpo = ''.join(filter(str.isdigit, str(telefone)))
	
	if len(tel_limpo) == 10:  # (XX) XXXX-XXXX
		return f"({tel_limpo[:2]}) {tel_limpo[2:6]}-{tel_limpo[6:]}"
	elif len(tel_limpo) == 11:  # (XX) 9XXXX-XXXX
		return f"({tel_limpo[:2]}) {tel_limpo[2:7]}-{tel_limpo[7:]}"
	
	return telefone


@frappe.whitelist()
def buscar_cep(cep):
	"""
	Busca endereço pelo CEP usando Brasil API
	
	Args:
		cep (str): CEP (com ou sem formatação)
		
	Returns:
		dict: Dados do endereço
	"""
	try:
		cep_limpo = ''.join(filter(str.isdigit, cep))
		
		if len(cep_limpo) != 8:
			return {
				"success": False,
				"message": _("CEP deve conter 8 dígitos")
			}
		
		url = f"https://brasilapi.com.br/api/cep/v2/{cep_limpo}"
		response = requests.get(url, timeout=10)
		
		if response.status_code == 200:
			dados = response.json()
			
			return {
				"success": True,
				"data": {
					"address_line1": dados.get("street", ""),
					"city": dados.get("city", ""),
					"state": dados.get("state", ""),
					"pincode": cep_limpo,
					"country": "Brazil",
					"bairro": dados.get("neighborhood", "")
				}
			}
		else:
			return {
				"success": False,
				"message": _("CEP não encontrado")
			}
			
	except Exception as e:
		frappe.log_error(frappe.get_traceback(), "Erro ao buscar CEP")
		return {
			"success": False,
			"message": _("Erro ao consultar CEP: {0}").format(str(e))
		}
