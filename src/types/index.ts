// Tipos globais e interfaces compartilhadas
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  companyId: string;
  avatar?: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  VIEWER = 'viewer'
}

export interface ICompany {
  _id: string;
  name: string;
  cnpj: string;
  email: string;
  phone: string;
  address: IAddress;
  customDomain?: string;
  subscription: ISubscription;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface ISubscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
}

export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
  TRIAL = 'trial'
}

export interface ICustomer {
  _id: string;
  companyId: string;
  name: string;
  email: string;
  phone: string;
  cpfCnpj: string;
  type: CustomerType;
  address?: IAddress;
  tags: string[];
  notes?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum CustomerType {
  INDIVIDUAL = 'individual',
  COMPANY = 'company'
}

export interface ISale {
  _id: string;
  companyId: string;
  customerId: string;
  userId: string;
  items: ISaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: SaleStatus;
  paymentMethod: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISaleItem {
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export enum SaleStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

// Request/Response types
export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  companyName: string;
  companyCnpj: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  avatar?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

// Express custom types
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
        companyId: string;
      };
    }
  }
}
