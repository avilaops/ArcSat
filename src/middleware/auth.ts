import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../types/index.js';
import User from '../models/User.js';
import config from '../config/env.js';

// Interface para o payload do JWT
interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  companyId: string;
  iat?: number;
  exp?: number;
}

// Middleware: Proteger rotas (requer autenticação)
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Verificar se o token existe no header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        status: 'error',
        message: 'Você não está logado. Por favor, faça login para ter acesso.',
      });
      return;
    }

    // Verificar token
    const decoded = jwt.verify(
      token,
      config.jwt.accessSecret
    ) as JwtPayload;

    // Verificar se o usuário ainda existe
    const user = await User.findById(decoded.id).select('+password');
    
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'O usuário não existe mais.',
      });
      return;
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      res.status(401).json({
        status: 'error',
        message: 'Este usuário está desativado.',
      });
      return;
    }

    // Adicionar usuário à requisição
    req.user = {
      id: String(user._id),
      email: user.email,
      role: user.role,
      companyId: String(user.companyId),
    };

    next();
  } catch (err) {
    res.status(401).json({
      status: 'error',
      message: 'Token inválido ou expirado',
    });
  }
};

// Middleware: Restringir acesso por role
export const restrictTo = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        status: 'error',
        message: 'Você não tem permissão para realizar esta ação',
      });
      return;
    }
    next();
  };
};

// Middleware: Verificar se o usuário pertence à mesma empresa
export const checkCompanyAccess = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const requestedCompanyId = req.params.companyId || req.body.companyId;

  if (!req.user) {
    res.status(401).json({
      status: 'error',
      message: 'Usuário não autenticado',
    });
    return;
  }

  // Admin pode acessar qualquer empresa
  if (req.user.role === UserRole.ADMIN) {
    next();
    return;
  }

  // Verificar se o usuário está acessando dados da própria empresa
  if (requestedCompanyId && requestedCompanyId !== req.user.companyId) {
    res.status(403).json({
      status: 'error',
      message: 'Você não tem acesso aos dados desta empresa',
    });
    return;
  }

  next();
};
