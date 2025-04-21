import type { User, AuthCredentials, RegisterData } from './types';
import { storeUser, clearStoredUser } from './storage';
import { validateLoginCredentials, validateRegistrationData } from './validation';
import type { UserRole } from './types';

const users: Array<User & { password: string }> = [
  {
    id: '1',
    name: 'John Client',
    email: 'client@example.com',
    password: 'client123',
    role: 'client',
    displayName: 'John C.',
    avatarUrl: 'https://example.com/avatar1.png',
    createdAt: new Date('2023-01-01').toISOString(),
    location: 'New York'
  },
  {
    id: '2',
    name: 'Sarah Student',
    email: 'student@example.com',
    password: 'student123',
    role: 'student',
    displayName: 'Sarah S.',
    avatarUrl: 'https://example.com/avatar2.png',
    createdAt: new Date('2023-02-01').toISOString(),
    location: 'Los Angeles'
  },
  {
    id: '3',
    name: 'Sarah Investor',
    email: 'investor@example.com',
    password: 'investor123',
    role: 'investor',
    displayName: 'Sarah I.',
    avatarUrl: 'https://example.com/avatar3.png',
    createdAt: new Date('2023-03-01').toISOString(),
    location: 'San Francisco'
  },
  {
    id: '4',
    name: 'Michael Professional',
    email: 'professional@example.com',
    password: 'professional123',
    role: 'professional',
    displayName: 'Michael P.',
    avatarUrl: 'https://example.com/avatar4.png',
    createdAt: new Date('2023-04-01').toISOString(),
    location: 'Chicago'
  },
  {
    id: '5',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
    displayName: 'Admin U.',
    avatarUrl: 'https://example.com/avatar5.png',
    createdAt: new Date('2023-05-01').toISOString(),
    location: 'Seattle' // Removed the extra comma
  }
];

export async function mockLogin(credentials: AuthCredentials): Promise<User> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const errors = validateLoginCredentials(credentials);
  if (errors.length > 0) {
    throw new Error(errors[0]);
  }

  const user = users.find(u => 
    u.email === credentials.email && 
    u.password === credentials.password
  );

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const { password: _, ...safeUser } = user;
  storeUser(safeUser);
  return safeUser;
}

export async function mockLogout(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  clearStoredUser();
}

export async function mockRegister(data: RegisterData): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const errors = validateRegistrationData(data);
  if (errors.length > 0) {
    throw new Error(errors[0]);
  }

  const existingUser = users.find(u => u.email === data.email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  if (data.role === 'admin') {
    throw new Error('Invalid role specified');
  }

const newUser = {
  isAdmin: false,
  name: data.name, 
  role: data.role as UserRole, // Ensure role matches UserRole type
  email: data.email,
  password: data.password,
  id: (users.length + 1).toString(),
  displayName: data.name,
  avatarUrl: '',
  createdAt: new Date().toISOString(),
  location: ''
};
  users.push(newUser);
  storeUser(newUser);
}
export async function mockGetUser(): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = users.find(u => u.id === localStorage.getItem('userId'));
  return user || null;
}
export async function mockGetAllUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return users;
}
export async function mockGetUserById(id: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = users.find(u => u.id === id);
  return user || null;
}
export async function mockUpdateUser(id: string, data: Partial<User>): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex] = { ...users[userIndex], ...data };
  storeUser(users[userIndex]);
}
export async function mockDeleteUser(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users.splice(userIndex, 1);
  clearStoredUser();
}
export async function mockGetUserRole(): Promise<string | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const storedUserId = localStorage.getItem('userId');
  if (!storedUserId) return null;

  const user = users.find(u => u.id === storedUserId);
  return user ? user.role : null;
}
export async function mockGetUserByEmail(email: string): Promise<User | null> {
  await new Promise(resolve => setTimeout(resolve, 500));
  const user = users.find(u => u.email === email);
  return user || null;
}