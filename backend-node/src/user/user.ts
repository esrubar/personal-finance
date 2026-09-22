// Domain Interface
import { HydratedDocument, Types } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export interface User {
  name: string;
  password: string;
  role: UserRole;
  auditable: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

export interface UserAuthProjection {
  _id: Types.ObjectId;
  name: string;
  password: string;
  role: UserRole;
}

export interface MinimalUser {
  id: string;
  name: string;
  role: UserRole;
}

export type UserDocument = HydratedDocument<User>;
