// Domain Interface
import {HydratedDocument, Types} from "mongoose";

export interface User {
    name: string;
    password: string;
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
}

export interface MinimalUser {
    id: string;
    name: string;
}

export type UserDocument = HydratedDocument<User>;