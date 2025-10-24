const mongoose = require('mongoose');
const crypto = require('crypto');

const webhookSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  events: [{
    type: String,
    enum: ['contact.created', 'contact.updated', 'deal.created', 'deal.updated', 'task.created', 'task.completed']
  }],
  secret: {
    type: String,
    default: () => crypto.randomBytes(32).toString('hex')
  },
  active: {
    type: Boolean,
    default: true
  },
  last_triggered: Date,
  error_count: {
    type: Number,
    default: 0
  }
});

// Método para gerar assinatura HMAC
webhookSchema.methods.generateSignature = function(payload) {
  const hmac = crypto.createHmac('sha256', this.secret);
  hmac.update(JSON.stringify(payload));
  return hmac.digest('hex');
};

// Método para disparar webhook
webhookSchema.methods.trigger = async function(event, payload) {
  if (!this.active || !this.events.includes(event)) {
    return;
  }

  const signature = this.generateSignature(payload);
  
  try {
    const response = await fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ArcSat-Signature': signature,
        'X-ArcSat-Event': event
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    this.last_triggered = new Date();
    this.error_count = 0;
    await this.save();

  } catch (error) {
    this.error_count += 1;
    
    // Desativar webhook após 5 falhas consecutivas
    if (this.error_count >= 5) {
      this.active = false;
    }
    
    await this.save();
    throw error;
  }
};

const Webhook = mongoose.model('Webhook', webhookSchema);

module.exports = Webhook;