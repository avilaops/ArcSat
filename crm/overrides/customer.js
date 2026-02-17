// -*- coding: utf-8 -*-
// Copyright (c) 2024, Avx Technologies and contributors
// For license information, please see license.txt

/**
 * Custom Fields para Customer com integração CNPJ/CPF
 */

frappe.ui.form.on('Customer', {
	refresh: function(frm) {
		// Adiciona botão para buscar dados do CNPJ
		if (frm.doc.cnpj && !frm.is_new()) {
			frm.add_custom_button(__('Atualizar Dados (CNPJ)'), function() {
				buscar_dados_cnpj(frm);
			}, __('Ações'));
		}
	},
	
	cnpj: function(frm) {
		if (frm.doc.cnpj && frm.doc.cnpj.length >= 14) {
			// Auto-busca ao preencher CNPJ
			validar_e_buscar_cnpj(frm);
		}
	},
	
	cpf: function(frm) {
		if (frm.doc.cpf && frm.doc.cpf.length >= 11) {
			validar_cpf(frm);
		}
	},
	
	tipo_documento: function(frm) {
		// Alterna visibilidade dos campos
		alternar_campos_documento(frm);
	}
});


function alternar_campos_documento(frm) {
	if (frm.doc.tipo_documento === 'CNPJ') {
		frm.set_df_property('cnpj', 'reqd', 1);
		frm.set_df_property('cnpj', 'hidden', 0);
		frm.set_df_property('cpf', 'reqd', 0);
		frm.set_df_property('cpf', 'hidden', 1);
		frm.set_value('cpf', '');
		frm.set_value('customer_type', 'Company');
	} else if (frm.doc.tipo_documento === 'CPF') {
		frm.set_df_property('cpf', 'reqd', 1);
		frm.set_df_property('cpf', 'hidden', 0);
		frm.set_df_property('cnpj', 'reqd', 0);
		frm.set_df_property('cnpj', 'hidden', 1);
		frm.set_value('cnpj', '');
		frm.set_value('customer_type', 'Individual');
	}
}


function validar_e_buscar_cnpj(frm) {
	let cnpj = frm.doc.cnpj;
	
	// Remove formatação
	let cnpj_limpo = cnpj.replace(/[^\d]/g, '');
	
	if (cnpj_limpo.length !== 14) {
		frappe.msgprint(__('CNPJ deve conter 14 dígitos'));
		return;
	}
	
	// Formata o CNPJ no campo
	frm.set_value('cnpj', formatarCNPJ(cnpj_limpo));
	
	// Busca dados
	buscar_dados_cnpj(frm);
}


function buscar_dados_cnpj(frm) {
	frappe.show_alert({
		message: __('Consultando Receita Federal...'),
		indicator: 'blue'
	});
	
	frappe.call({
		method: 'crm.api.brasil_api.buscar_dados_cnpj',
		args: {
			cnpj: frm.doc.cnpj
		},
		callback: function(r) {
			if (r.message && r.message.success) {
				let data = r.message.data;
				
				// Preenche campos do cliente
				if (!frm.doc.customer_name || frm.doc.customer_name === frm.doc.cnpj) {
					frm.set_value('customer_name', data.customer_name);
				}
				
				frm.set_value('customer_type', 'Company');
				frm.set_value('tax_id', data.tax_id);
				
				// Campos customizados
				if (data.razao_social) frm.set_value('razao_social', data.razao_social);
				if (data.nome_fantasia) frm.set_value('nome_fantasia', data.nome_fantasia);
				if (data.inscricao_estadual) frm.set_value('inscricao_estadual', data.inscricao_estadual);
				if (data.natureza_juridica) frm.set_value('natureza_juridica', data.natureza_juridica);
				if (data.porte) frm.set_value('porte_empresa', data.porte);
				if (data.situacao_cadastral) frm.set_value('situacao_cadastral', data.situacao_cadastral);
				if (data.cnae_fiscal) frm.set_value('cnae_fiscal', data.cnae_fiscal);
				if (data.cnae_fiscal_descricao) frm.set_value('cnae_fiscal_descricao', data.cnae_fiscal_descricao);
				
				// Email e telefone
				if (data.email && !frm.doc.email_id) {
					frm.set_value('email_id', data.email);
				}
				
				if (data.telefone) {
					frm.set_value('telefone_principal', data.telefone);
				}
				
				frappe.show_alert({
					message: __('Dados importados com sucesso!'),
					indicator: 'green'
				}, 5);
				
				// Pergunta se quer criar/atualizar endereço
				if (data.endereco) {
					frappe.confirm(
						__('Deseja criar/atualizar o endereço com os dados da Receita Federal?'),
						function() {
							criar_endereco_cliente(frm, data.endereco);
						}
					);
				}
				
			} else {
				frappe.msgprint({
					title: __('Erro'),
					message: r.message.message || __('Erro ao consultar CNPJ'),
					indicator: 'red'
				});
			}
		}
	});
}


function validar_cpf(frm) {
	let cpf = frm.doc.cpf;
	let cpf_limpo = cpf.replace(/[^\d]/g, '');
	
	if (cpf_limpo.length !== 11) {
		frappe.msgprint(__('CPF deve conter 11 dígitos'));
		return;
	}
	
	// Formata CPF
	frm.set_value('cpf', formatarCPF(cpf_limpo));
	
	// Valida
	frappe.call({
		method: 'crm.api.brasil_api.validar_cpf_cnpj',
		args: {
			documento: cpf_limpo
		},
		callback: function(r) {
			if (r.message && r.message.success) {
				frappe.show_alert({
					message: __('CPF válido'),
					indicator: 'green'
				});
				frm.set_value('customer_type', 'Individual');
				frm.set_value('tax_id', frm.doc.cpf);
			} else {
				frappe.msgprint({
					title: __('Erro'),
					message: r.message.message || __('CPF inválido'),
					indicator: 'red'
				});
				frm.set_value('cpf', '');
			}
		}
	});
}


function criar_endereco_cliente(frm, endereco_data) {
	frappe.call({
		method: 'frappe.client.insert',
		args: {
			doc: {
				doctype: 'Address',
				address_title: frm.doc.customer_name,
				address_type: 'Billing',
				address_line1: endereco_data.address_line1,
				address_line2: endereco_data.address_line2,
				city: endereco_data.city,
				state: endereco_data.state,
				pincode: endereco_data.pincode,
				country: endereco_data.country,
				links: [{
					link_doctype: 'Customer',
					link_name: frm.doc.name
				}]
			}
		},
		callback: function(r) {
			if (r.message) {
				frappe.show_alert({
					message: __('Endereço criado com sucesso'),
					indicator: 'green'
				});
				frm.reload_doc();
			}
		}
	});
}


function formatarCNPJ(cnpj) {
	// 12.345.678/0001-90
	return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}


function formatarCPF(cpf) {
	// 123.456.789-01
	return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}
