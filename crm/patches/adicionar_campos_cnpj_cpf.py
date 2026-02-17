# -*- coding: utf-8 -*-
# Copyright (c) 2024, Avx Technologies and contributors
# For license information, please see license.txt

"""
Script para adicionar campos customizados de CNPJ/CPF
aos DocTypes Customer e Supplier do ArcSat
"""

import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields


def execute():
	"""
	Adiciona campos customizados para CNPJ/CPF
	"""
	custom_fields = get_custom_fields()
	create_custom_fields(custom_fields, update=True)
	print("Campos customizados criados com sucesso!")


def get_custom_fields():
	"""
	Define os campos customizados para Customer e Supplier
	"""
	
	# Campos comuns para Customer e Supplier
	campos_brasil = {
		'tipo_documento': {
			'fieldname': 'tipo_documento',
			'label': 'Tipo de Documento',
			'fieldtype': 'Select',
			'options': '\nCNPJ\nCPF',
			'insert_after': 'customer_type',
			'translatable': 0
		},
		'cnpj': {
			'fieldname': 'cnpj',
			'label': 'CNPJ',
			'fieldtype': 'Data',
			'insert_after': 'tipo_documento',
			'depends_on': 'eval:doc.tipo_documento=="CNPJ"',
			'length': 18,
			'translatable': 0,
			'description': 'Digite o CNPJ (apenas números ou formatado)'
		},
		'cpf': {
			'fieldname': 'cpf',
			'label': 'CPF',
			'fieldtype': 'Data',
			'insert_after': 'cnpj',
			'depends_on': 'eval:doc.tipo_documento=="CPF"',
			'length': 14,
			'translatable': 0,
			'description': 'Digite o CPF (apenas números ou formatado)'
		},
		'section_break_dados_brasil': {
			'fieldname': 'section_break_dados_brasil',
			'label': 'Dados Brasileiros',
			'fieldtype': 'Section Break',
			'insert_after': 'cpf',
			'collapsible': 1
		},
		'razao_social': {
			'fieldname': 'razao_social',
			'label': 'Razão Social',
			'fieldtype': 'Data',
			'insert_after': 'section_break_dados_brasil',
			'length': 200,
			'translatable': 0,
			'read_only': 1
		},
		'nome_fantasia': {
			'fieldname': 'nome_fantasia',
			'label': 'Nome Fantasia',
			'fieldtype': 'Data',
			'insert_after': 'razao_social',
			'length': 200,
			'translatable': 0,
			'read_only': 1
		},
		'column_break_brasil_1': {
			'fieldname': 'column_break_brasil_1',
			'fieldtype': 'Column Break',
			'insert_after': 'nome_fantasia'
		},
		'inscricao_estadual': {
			'fieldname': 'inscricao_estadual',
			'label': 'Inscrição Estadual',
			'fieldtype': 'Data',
			'insert_after': 'column_break_brasil_1',
			'length': 20,
			'translatable': 0
		},
		'inscricao_municipal': {
			'fieldname': 'inscricao_municipal',
			'label': 'Inscrição Municipal',
			'fieldtype': 'Data',
			'insert_after': 'inscricao_estadual',
			'length': 20,
			'translatable': 0
		},
		'section_break_dados_fiscais': {
			'fieldname': 'section_break_dados_fiscais',
			'label': 'Dados Fiscais e Cadastrais',
			'fieldtype': 'Section Break',
			'insert_after': 'inscricao_municipal',
			'collapsible': 1,
			'depends_on': 'eval:doc.tipo_documento=="CNPJ"'
		},
		'natureza_juridica': {
			'fieldname': 'natureza_juridica',
			'label': 'Natureza Jurídica',
			'fieldtype': 'Data',
			'insert_after': 'section_break_dados_fiscais',
			'length': 200,
			'translatable': 0,
			'read_only': 1
		},
		'porte_empresa': {
			'fieldname': 'porte_empresa',
			'label': 'Porte da Empresa',
			'fieldtype': 'Data',
			'insert_after': 'natureza_juridica',
			'length': 50,
			'translatable': 0,
			'read_only': 1
		},
		'column_break_brasil_2': {
			'fieldname': 'column_break_brasil_2',
			'fieldtype': 'Column Break',
			'insert_after': 'porte_empresa'
		},
		'situacao_cadastral': {
			'fieldname': 'situacao_cadastral',
			'label': 'Situação Cadastral',
			'fieldtype': 'Data',
			'insert_after': 'column_break_brasil_2',
			'length': 100,
			'translatable': 0,
			'read_only': 1
		},
		'cnae_fiscal': {
			'fieldname': 'cnae_fiscal',
			'label': 'CNAE Fiscal',
			'fieldtype': 'Data',
			'insert_after': 'situacao_cadastral',
			'length': 10,
			'translatable': 0,
			'read_only': 1
		},
		'cnae_fiscal_descricao': {
			'fieldname': 'cnae_fiscal_descricao',
			'label': 'Descrição CNAE',
			'fieldtype': 'Small Text',
			'insert_after': 'cnae_fiscal',
			'translatable': 0,
			'read_only': 1
		},
		'telefone_principal': {
			'fieldname': 'telefone_principal',
			'label': 'Telefone Principal',
			'fieldtype': 'Data',
			'insert_after': 'cnae_fiscal_descricao',
			'length': 20,
			'translatable': 0
		}
	}
	
	# Ajusta insert_after para Supplier
	campos_supplier = []
	for key, field in campos_brasil.items():
		campo = field.copy()
		if campo['insert_after'] == 'customer_type':
			campo['insert_after'] = 'supplier_type'
		campos_supplier.append(campo)
	
	# Converte dicionário para lista
	campos_customer_list = list(campos_brasil.values())
	
	return {
		'Customer': campos_customer_list,
		'Supplier': campos_supplier
	}


def remover_campos_customizados():
	"""
	Remove os campos customizados criados (útil para desenvolvimento/teste)
	"""
	campos = [
		'tipo_documento', 'cnpj', 'cpf', 'section_break_dados_brasil',
		'razao_social', 'nome_fantasia', 'column_break_brasil_1',
		'inscricao_estadual', 'inscricao_municipal', 
		'section_break_dados_fiscais', 'natureza_juridica',
		'porte_empresa', 'column_break_brasil_2', 'situacao_cadastral',
		'cnae_fiscal', 'cnae_fiscal_descricao', 'telefone_principal'
	]
	
	for doctype in ['Customer', 'Supplier']:
		for campo in campos:
			custom_field_name = f'{doctype}-{campo}'
			if frappe.db.exists('Custom Field', custom_field_name):
				frappe.delete_doc('Custom Field', custom_field_name)
				print(f"Campo {custom_field_name} removido")
	
	frappe.db.commit()
	print("Campos customizados removidos com sucesso!")


if __name__ == '__main__':
	execute()
