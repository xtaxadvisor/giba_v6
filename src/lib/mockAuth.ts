import { User } from '../types';
import { createSecureHash } from '../utils/crypto';

// Mock user storage with enhanced admin validation
const users = [
  {
    id: '1',
    name: 'John Client',
    email: 'client@example.com',
    password: 'Client123!@#',
    role: 'client',
    avatarUrl: '',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sarah Student',
    email: 'student@example.com', 
    role: 'student',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Sarah Investor',
    role: 'investor',
    createdAt: new Date().toISOString()
  },
  {
    id: '4',
    name: 'Professional User',
    email: 'professional@example.com',
    password: 'Professional123!@#',
    role: 'professional',
    createdAt: new Date().toISOString()
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin123!@#',
    role: 'admin',
    isAdmin: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '6',
    name: 'Super Admin',
    email: 'superadmin@example.com',
    password: 'SuperAdmin123!@#',
    role: 'superadmin',
    isAdmin: true,
    createdAt: new Date().toISOString()
  }
];

export async function mockLogin(email: string, password: string): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const hashedPassword = await createSecureHash(password);
  const user = users.find(u => u.email === email && u.password === hashedPassword);
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Additional validation for admin login attempts
  if (user.role === 'admin' && !user.isAdmin) {
    throw new Error('Unauthorized access attempt');
  }
  const { password: _, avatarUrl, ...safeUser } = user as User & { password?: string; avatarUrl?: string };
  if (!safeUser.email) {
    throw new Error('User email is missing');
  }
  const completeUser: User = {
    ...safeUser,
    email: safeUser.email,
    avatarUrl: avatarUrl || '',
    createdAt: safeUser.createdAt || new Date().toISOString(),
    location: safeUser.location || 'Unknown'
  };
  localStorage.setItem('currentUser', JSON.stringify(completeUser));
  return completeUser;
}

export async function mockLogout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  localStorage.removeItem('currentUser');
}

export async function mockCheckAuth(): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const userData = localStorage.getItem('currentUser');
  if (!userData) return null;
  
  const user = JSON.parse(userData);
  // Additional validation for stored admin sessions
  if (user.role === 'admin' && !user.isAdmin) {
    localStorage.removeItem('currentUser');
    return null;
  }
  
  return user;
}

export async function mockRegister(userData: {
  name: string;
  email: string;
  password: string;
  role: string;
}): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  // Prevent registration of admin users through normal registration
  if (userData.role === 'admin') {
    throw new Error('Invalid role specified');
  }
  const hashedPassword = await createSecureHash(userData.password);
  const newUser = {
    id: String(users.length + 1),
    ...userData,
    password: hashedPassword,
    isAdmin: false,
    createdAt: new Date().toISOString(),
    avatarUrl: undefined
  };
  users.push(newUser);
};