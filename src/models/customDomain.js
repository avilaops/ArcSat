const mongoose = require('mongoose');
const dns = require('dns').promises;

const customDomainSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  domain: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  verification_token: String,
  ssl_status: {
    type: String,
    enum: ['pending', 'active', 'error'],
    default: 'pending'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Método para verificar propriedade do domínio
customDomainSchema.methods.verifyDomain = async function() {
  try {
    const records = await dns.resolveCname(this.domain);
    const isValid = records.some(record => record === 'app.arcsat.com.br');
    
    if (isValid) {
      this.verified = true;
      await this.save();
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error verifying domain ${this.domain}:`, error);
    return false;
  }
};

// Middleware para validar formato do domínio
customDomainSchema.pre('save', function(next) {
  if (this.isModified('domain')) {
    const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$/;
    if (!domainRegex.test(this.domain)) {
      next(new Error('Invalid domain format'));
    }
  }
  next();
});

const CustomDomain = mongoose.model('CustomDomain', customDomainSchema);

module.exports = CustomDomain;