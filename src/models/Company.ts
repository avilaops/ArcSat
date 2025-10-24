import mongoose, { Schema, Document, Model } from 'mongoose';
import {
  ICompany,
  IAddress,
  ISubscription,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../types/index.js';

// Interface do documento (métodos de instância)
export interface ICompanyDocument extends Omit<ICompany, '_id'>, Document {
  validateCNPJ(): boolean;
}

// Interface do modelo (métodos estáticos)
export interface ICompanyModel extends Model<ICompanyDocument> {
  findByCNPJ(cnpj: string): Promise<ICompanyDocument | null>;
}

// Sub-schema para endereço
const addressSchema = new Schema<IAddress>(
  {
    street: {
      type: String,
      required: [true, 'Rua é obrigatória'],
      trim: true,
    },
    number: {
      type: String,
      required: [true, 'Número é obrigatório'],
      trim: true,
    },
    complement: {
      type: String,
      trim: true,
    },
    neighborhood: {
      type: String,
      required: [true, 'Bairro é obrigatório'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Cidade é obrigatória'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Estado é obrigatório'],
      trim: true,
      uppercase: true,
      minlength: [2, 'Estado deve ter 2 caracteres'],
      maxlength: [2, 'Estado deve ter 2 caracteres'],
    },
    zipCode: {
      type: String,
      required: [true, 'CEP é obrigatório'],
      trim: true,
      match: [/^\d{5}-?\d{3}$/, 'CEP inválido'],
    },
  },
  { _id: false }
);

// Sub-schema para assinatura
const subscriptionSchema = new Schema<ISubscription>(
  {
    plan: {
      type: String,
      enum: Object.values(SubscriptionPlan),
      default: SubscriptionPlan.FREE,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(SubscriptionStatus),
      default: SubscriptionStatus.TRIAL,
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Data de início é obrigatória'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: null,
    },
  },
  { _id: false }
);

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
      match: [/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido'],
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Email é obrigatório'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Telefone é obrigatório'],
      trim: true,
      match: [/^\(\d{2}\)\s?\d{4,5}-?\d{4}$/, 'Telefone inválido'],
    },
    address: {
      type: addressSchema,
      required: [true, 'Endereço é obrigatório'],
    },
    customDomain: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/, 'Domínio inválido'],
      sparse: true,
      unique: true,
    },
    subscription: {
      type: subscriptionSchema,
      required: true,
      default: () => ({
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.TRIAL,
        startDate: new Date(),
      }),
    },
    settings: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Índices compostos
companySchema.index({ cnpj: 1, email: 1 });
companySchema.index({ 'subscription.status': 1, 'subscription.plan': 1 });

// Método de instância: Validar CNPJ
companySchema.methods.validateCNPJ = function (): boolean {
  const cnpj = this.cnpj.replace(/[^\d]/g, '');
  
  if (cnpj.length !== 14) {
    return false;
  }
  
  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cnpj)) {
    return false;
  }
  
  // Validação dos dígitos verificadores
  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  
  if (resultado !== parseInt(digitos.charAt(0))) {
    return false;
  }
  
  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  
  for (let i = tamanho; i >= 1; i--) {
    soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }
  
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  
  if (resultado !== parseInt(digitos.charAt(1))) {
    return false;
  }
  
  return true;
};

// Método estático: Buscar por CNPJ
companySchema.statics.findByCNPJ = function (cnpj: string) {
  return this.findOne({ cnpj });
};

const Company = mongoose.model<ICompanyDocument, ICompanyModel>(
  'Company',
  companySchema
);

export default Company;
