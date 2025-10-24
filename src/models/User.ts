import mongoose, { Schema, Document, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, UserRole } from '../types/index.js';
import config from '../config/env.js';

// Interface do documento (métodos de instância)
export interface IUserDocument extends Omit<IUser, '_id'>, Document {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface do modelo (métodos estáticos)
export interface IUserModel extends Model<IUserDocument> {
  findByEmail(email: string): Promise<IUserDocument | null>;
}

const userSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: [true, 'Nome é obrigatório'],
      trim: true,
      minlength: [2, 'Nome deve ter no mínimo 2 caracteres'],
      maxlength: [100, 'Nome deve ter no máximo 100 caracteres'],
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
    password: {
      type: String,
      required: [true, 'Senha é obrigatória'],
      minlength: [6, 'Senha deve ter no mínimo 6 caracteres'],
      select: false, // Não retornar senha por padrão
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER,
    },
    companyId: {
      type: String,
      required: [true, 'Empresa é obrigatória'],
      index: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete (ret as any).__v;
        delete (ret as any).password;
        return ret;
      },
    },
  }
);

// Índices compostos
userSchema.index({ email: 1, companyId: 1 });
userSchema.index({ companyId: 1, isActive: 1 });

// Hook: Hash password antes de salvar
userSchema.pre('save', async function (next) {
  // Só faz hash se a senha foi modificada
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(config.bcrypt.saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método de instância: Comparar senha
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    return false;
  }
};

// Método estático: Buscar por email
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() }).select('+password');
};

const User = mongoose.model<IUserDocument, IUserModel>('User', userSchema);

export default User;
