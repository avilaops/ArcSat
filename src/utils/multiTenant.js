const mongoose = require('mongoose');

// Schema base para multi-tenancy
const multiTenantSchema = {
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
};

// Middleware para adicionar company_id automaticamente
const multiTenantMiddleware = function(next) {
  if (this.isNew || this.isModified()) {
    const currentUser = this.constructor.getCurrentUser();
    if (!currentUser || !currentUser.company_id) {
      return next(new Error('Company ID is required'));
    }
    this.company_id = currentUser.company_id;
    this.updated_at = new Date();
    this.updated_by = currentUser._id;
    
    if (this.isNew) {
      this.created_by = currentUser._id;
    }
  }
  next();
};

// Plugin para adicionar funcionalidade multi-tenant aos schemas
const multiTenantPlugin = (schema) => {
  // Adicionar campos base
  schema.add(multiTenantSchema);
  
  // Adicionar índices compostos
  schema.index({ company_id: 1, created_at: -1 });
  
  // Middleware para salvar
  schema.pre('save', multiTenantMiddleware);
  
  // Middleware para queries - garantir que company_id está sempre presente
  schema.pre(/^find/, function(next) {
    const currentUser = this.model.getCurrentUser();
    if (!currentUser || !currentUser.company_id) {
      return next(new Error('Company ID is required for queries'));
    }
    this.where({ company_id: currentUser.company_id });
    next();
  });
};

module.exports = multiTenantPlugin;