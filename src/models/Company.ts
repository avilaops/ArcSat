import mongoose, { Schema, Document, Model } from 'mongoose';
import { ICompany, IAddress, ISubscription, SubscriptionPlan, SubscriptionStatus } from '../types/index.js';

// Interface do documento (métodos de instância)
export interface ICompanyDocument extends Omit<ICompany, '_id'>, Document {
  isActive(): boolean;
  isSubscriptionActive(): boolean;
  updateSubscription(plan: SubscriptionPlan, status: SubscriptionStatus): Promise<ICompanyDocument>;
}

// Interface do modelo (métodos estáticos)
export interface ICompanyModel extends Model<ICompanyDocument> {
  findByCnpj(cnpj: string): Promise<ICompanyDocument | null>;
  findActiveCompanies(): Promise<ICompanyDocument[]>;
  findBySubscriptionPlan(plan: SubscriptionPlan): Promise<ICompanyDocument[]>;
}

// Função auxiliar para validação de CNPJ
function validateCnpjDigits(cnpj: string): boolean {
  // Cálculo do primeiro dígito verificador
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  const firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  if (parseInt(cnpj[12]) !== firstDigit) return false;
  
  // Cálculo do segundo dígito verificador
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  const secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  return parseInt(cnpj[13]) === secondDigit;
}

// Schema para endereço
const addressSchema = new Schema<IAddress>(
  {
    street: {
      type: String,
      required: [true, 'Logradouro é obrigatório'],
      trim: true,
      maxlength: [200, 'Logradouro deve ter no máximo 200 caracteres'],
    },
    number: {
      type: String,
      required: [true, 'Número é obrigatório'],
      trim: true,
      maxlength: [20, 'Número deve ter no máximo 20 caracteres'],
    },
    complement: {
      type: String,
      trim: true,
      maxlength: [100, 'Complemento deve ter no máximo 100 caracteres'],
    },
    neighborhood: {
      type: String,
      required: [true, 'Bairro é obrigatório'],
      trim: true,
      maxlength: [100, 'Bairro deve ter no máximo 100 caracteres'],
    },
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true,
      maxlength: [100, 'Cidade deve ter no máximo 100 caracteres'],
    },
    state: {
      type: String,
      required: [true, 'Estado é obrigatório'],
      trim: true,
      length: [2, 'Estado deve ter exatamente 2 caracteres'],
      uppercase: true,
    },
    zipCode: {
      type: String,
      required: [true, 'CEP é obrigatório'],
      trim: true,
      match: [/^\d{5}-?\d{3}$/, 'CEP inválido (formato: 12345-678)'],
    },
  },
  { _id: false }
);

// Schema para assinatura
const subscriptionSchema = new Schema<ISubscription>(
  {
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE,
      required: [true, 'Plano de assinatura é obrigatório'],
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.TRIAL,
      required: [true, 'Status da assinatura é obrigatório'],
    },
    startDate: {
      type: Date,
      required: [true, 'Data de início é obrigatória'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      validate: {
        validator: function(this: ISubscription, value: Date) {
          return !value || value > this.startDate;
        },
        message: 'Data de término deve ser posterior à data de início',
      },
    },
  },
  { _id: false }
);

// Schema principal da empresa
const companySchema = new Schema<ICompanyDocument, ICompanyModel>(
  {
    name: {
      type: String,
      required: [true, 'Nome da empresa é obrigatório'],
      trim: true,
      minlength: [2, 'Nome deve ter no mínimo 2 caracteres'],
      maxlength: [200, 'Nome deve ter no máximo 200 caracteres'],
      index: true,
    },
    cnpj: {
      type: String,
      required: [true, 'CNPJ é obrigatório'],
      unique: true,
      trim: true,
      validate: {
        validator: function(v: string) {
          // Remove caracteres não numéricos
          const cleanCnpj = v.replace(/[^\d]/g, '');
          // Verifica se tem 14 dígitos
          if (cleanCnpj.length !== 14) return false;
          // Verifica se não são todos iguais
          if (/^(\d)\1+$/.test(cleanCnpj)) return false;
          // Validação dos dígitos verificadores
          return validateCnpjDigits(cleanCnpj);
        },
        message: 'CNPJ inválido',
      },
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Telefone é obrigatório'],
      trim: true,
      match: [/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido (formato: (11) 99999-9999)'],
    },
    address: {
      type: addressSchema,
      required: [true, 'Endereço é obrigatório'],
    },
    customDomain: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+\.[a-z]{2,}$/, 'Domínio inválido'],
      index: { unique: true, sparse: true }, // Único, mas permite null/undefined
    },
    subscription: {
      type: subscriptionSchema,
      required: [true, 'Assinatura é obrigatória'],
      default: () => ({
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.TRIAL,
        startDate: new Date(),
      }),
    },
    settings: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Índices compostos
companySchema.index({ 'subscription.plan': 1, 'subscription.status': 1 });
companySchema.index({ createdAt: 1 });
companySchema.index({ name: 'text', email: 'text' }); // Text search

// Hook: Normalizar CNPJ antes de salvar
companySchema.pre('save', function (next) {
  if (this.isModified('cnpj')) {
    // Remove caracteres não numéricos e adiciona formatação
    const cleanCnpj = this.cnpj.replace(/[^\d]/g, '');
    this.cnpj = cleanCnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  
  if (this.isModified('phone')) {
    // Normaliza telefone
    const cleanPhone = this.phone.replace(/[^\d]/g, '');
    if (cleanPhone.length === 10) {
      this.phone = cleanPhone.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3');
    } else if (cleanPhone.length === 11) {
      this.phone = cleanPhone.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }
  }
  
  next();
});

// Método de instância: Verificar se empresa está ativa
companySchema.methods.isActive = function(): boolean {
  return this.subscription.status === SubscriptionStatus.ACTIVE || 
         this.subscription.status === SubscriptionStatus.TRIAL;
};

// Método de instância: Verificar se assinatura está ativa
companySchema.methods.isSubscriptionActive = function(): boolean {
  const now = new Date();
  return this.subscription.status === SubscriptionStatus.ACTIVE &&
         (!this.subscription.endDate || this.subscription.endDate > now);
};

// Método de instância: Atualizar assinatura
companySchema.methods.updateSubscription = async function(
  plan: SubscriptionPlan, 
  status: SubscriptionStatus
): Promise<ICompanyDocument> {
  this.subscription.plan = plan;
  this.subscription.status = status;
  
  if (status === SubscriptionStatus.ACTIVE && plan !== SubscriptionPlan.FREE) {
    // Define data de término baseada no plano
    const endDate = new Date();
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 ano
    this.subscription.endDate = endDate;
  }
  
  return await this.save();
};

// Método estático: Buscar por CNPJ
companySchema.statics.findByCnpj = function(cnpj: string) {
  const cleanCnpj = cnpj.replace(/[^\d]/g, '');
  const formattedCnpj = cleanCnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  return this.findOne({ cnpj: formattedCnpj });
};

// Método estático: Buscar empresas ativas
companySchema.statics.findActiveCompanies = function() {
  return this.find({
    'subscription.status': { 
      $in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.TRIAL] 
    }
  });
};

// Método estático: Buscar por plano de assinatura
companySchema.statics.findBySubscriptionPlan = function(plan: SubscriptionPlan) {
  return this.find({ 'subscription.plan': plan });
};

const Company = mongoose.model<ICompanyDocument, ICompanyModel>('Company', companySchema);

export default Company;