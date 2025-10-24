import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Nome é obrigatório"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email é obrigatório"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Email inválido"]
  },
  password: {
    type: String,
    required: [true, "Senha é obrigatória"],
    minlength: [8, "Senha deve ter no mínimo 8 caracteres"],
    select: false
  },
  role: {
    type: String,
    enum: ["admin", "user", "manager"],
    default: "user"
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date
  }
});

// Hash da senha antes de salvar
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método para verificar senha
userSchema.methods.checkPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;