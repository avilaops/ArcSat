import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome da empresa é obrigatório"],
    trim: true
  },
  cnpj: {
    type: String,
    required: [true, "CNPJ é obrigatório"],
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(v);
      },
      message: "CNPJ inválido"
    }
  },
  address: {
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String
  },
  contacts: [{
    name: String,
    role: String,
    phone: String,
    email: String
  }],
  category: {
    type: String,
    enum: ["cliente", "fornecedor", "parceiro"],
    required: true
  },
  status: {
    type: String,
    enum: ["ativo", "inativo", "prospecto"],
    default: "ativo"
  },
  contractStartDate: Date,
  contractEndDate: Date,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Atualizar o updatedAt antes de salvar
companySchema.pre("save", function(next) {
  this.updatedAt = new Date();
  next();
});

const Company = mongoose.model("Company", companySchema);

export default Company;