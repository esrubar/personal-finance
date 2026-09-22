import type { Auditable } from './auditable';

export interface User {
  _id: string;
  name: string;
  password: string;
  auditable: Auditable;
  role: 'admin' | 'user';
}

export interface MinimalUser {
  id: string;
  name: string;
  role: 'admin' | 'user';
}
