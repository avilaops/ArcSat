import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Verificar se o token existe no header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Você não está logado. Por favor, faça login para ter acesso."
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Verificar se o usuário ainda existe
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "O usuário não existe mais."
      });
    }

    // Verificar se o usuário está ativo
    if (!user.active) {
      return res.status(401).json({
        status: "error",
        message: "Este usuário está desativado."
      });
    }

    // Adicionar usuário à requisição
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({
      status: "error",
      message: "Token inválido ou expirado"
    });
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Você não tem permissão para realizar esta ação"
      });
    }
    next();
  };
};