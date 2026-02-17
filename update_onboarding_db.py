import os
import frappe

# Mudar para o diretório do bench
os.chdir('/home/frappe/frappe-bench')

# Inicializar frappe
frappe.init(site='crm.localhost')
frappe.connect()

# Atualizar mensagens de onboarding no banco
frappe.db.sql("""
    UPDATE `tabModule Onboarding` 
    SET title = %s, success_message = %s 
    WHERE name = 'Home'
""", ("Let's begin your journey with ArcSat", "You're ready to start your journey with ArcSat"))

# Atualizar descrição do item onboarding
frappe.db.sql("""
    UPDATE `tabOnboarding Step` 
    SET description = %s 
    WHERE name = 'Create an Item'
""", ("""# Create an Item

Item is a product or a service offered by your company, or something you buy as a part of your supplies or raw materials.

Items are integral to everything you do in ArcSat - from billing, purchasing to managing inventory. Everything you buy or sell, whether it is a physical product or a service is an Item. Items can be stock, non-stock, variants, serialized, batched, assets, etc.
""",))

frappe.db.commit()
print("✅ Mensagens de onboarding atualizadas para ArcSat!")
