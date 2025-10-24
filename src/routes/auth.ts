import express, { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import User from '../models/User.js';
import Company from '../models/Company.js';
import config from '../config/env.js';
import {
  AuthRequest,
  RegisterRequest,
  AuthResponse,
  UserResponse,
  SubscriptionPlan,
  SubscriptionStatus,
} from '../types/index.js';

const router = express.Router();

// Função auxiliar: Gerar tokens JWT
const generateTokens = (
  userId: string,
  email: string,
  role: string,
  companyId: string
): { accessToken: string; refreshToken: string } => {
  const payload = {
    id: userId,
    email,
    role,
    companyId,
  };

  const accessOptions: SignOptions = {
    expiresIn: config.jwt.accessExpiration as SignOptions['expiresIn'],
  };

  const refreshOptions: SignOptions = {
    expiresIn: config.jwt.refreshExpiration as SignOptions['expiresIn'],
  };

  const accessToken = jwt.sign(payload, config.jwt.accessSecret, accessOptions);
  const refreshToken = jwt.sign(payload, config.jwt.refreshSecret, refreshOptions);

  return { accessToken, refreshToken };
};

// POST /auth/register - Registro de novo usuário e empresa
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      companyName,
      companyCnpj,
    } = req.body as RegisterRequest;

    // Validar campos obrigatórios
    if (!name || !email || !password || !companyName || !companyCnpj) {
      res.status(400).json({
        status: 'error',
        message: 'Todos os campos são obrigatórios',
      });
      return;
    }

    // Verificar se o email já existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      res.status(400).json({
        status: 'error',
        message: 'Email já cadastrado',
      });
      return;
    }

    // Verificar se o CNPJ já existe
    const existingCompany = await Company.findByCNPJ(companyCnpj);
    if (existingCompany) {
      res.status(400).json({
        status: 'error',
        message: 'CNPJ já cadastrado',
      });
      return;
    }

    // Criar empresa
    const company = await Company.create({
      name: companyName,
      cnpj: companyCnpj,
      email: email,
      phone: '(00) 0000-0000', // Placeholder - pode ser atualizado depois
      address: {
        street: 'A definir',
        number: 'S/N',
        neighborhood: 'A definir',
        city: 'A definir',
        state: 'SP',
        zipCode: '00000-000',
      },
      subscription: {
        plan: SubscriptionPlan.FREE,
        status: SubscriptionStatus.TRIAL,
        startDate: new Date(),
      },
      settings: {},
    });

    // Criar usuário admin
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      companyId: company._id,
      isActive: true,
    });

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(
      String(user._id),
      user.email,
      user.role,
      String(company._id)
    );

    const response: AuthResponse = {
      accessToken,
      refreshToken,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: String(company._id),
        avatar: user.avatar,
      },
    };

    res.status(201).json({
      status: 'success',
      data: response,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err instanceof Error ? err.message : 'Erro ao registrar usuário',
    });
  }
});

// POST /auth/login - Login de usuário
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as AuthRequest;

    // Validar campos obrigatórios
    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Email e senha são obrigatórios',
      });
      return;
    }

    // Verificar se o usuário existe
    const user = await User.findByEmail(email);
    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Email ou senha incorretos',
      });
      return;
    }

    // Verificar se o usuário está ativo
    if (!user.isActive) {
      res.status(401).json({
        status: 'error',
        message: 'Usuário desativado. Entre em contato com o suporte.',
      });
      return;
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        status: 'error',
        message: 'Email ou senha incorretos',
      });
      return;
    }

    // Atualizar último login
    user.lastLogin = new Date();
    await user.save();

    // Gerar tokens
    const { accessToken, refreshToken } = generateTokens(
      String(user._id),
      user.email,
      user.role,
      String(user.companyId)
    );

    const response: AuthResponse = {
      accessToken,
      refreshToken,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: String(user.companyId),
        avatar: user.avatar,
      },
    };

    res.status(200).json({
      status: 'success',
      data: response,
    });
  } catch (err) {
    res.status(400).json({
      status: 'error',
      message: err instanceof Error ? err.message : 'Erro ao fazer login',
    });
  }
});

// POST /auth/refresh - Renovar access token usando refresh token
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        status: 'error',
        message: 'Refresh token é obrigatório',
      });
      return;
    }

    // Verificar refresh token
    const decoded = jwt.verify(
      refreshToken,
      config.jwt.refreshSecret
    ) as { id: string; email: string; role: string; companyId: string };

    // Verificar se o usuário ainda existe e está ativo
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      res.status(401).json({
        status: 'error',
        message: 'Usuário inválido ou desativado',
      });
      return;
    }

    // Gerar novos tokens
    const tokens = generateTokens(
      String(user._id),
      user.email,
      user.role,
      String(user.companyId)
    );

    const userResponse: UserResponse = {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: String(user.companyId),
      avatar: user.avatar,
    };

    const response: AuthResponse = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userResponse,
    };

    res.status(200).json({
      status: 'success',
      data: response,
    });
  } catch (err) {
    res.status(401).json({
      status: 'error',
      message: 'Refresh token inválido ou expirado',
    });
  }
});

export default router;
