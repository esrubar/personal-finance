export interface User {
    _id: string;
    name: string;
    password: string;
    auditable: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}

export interface MinimalUser {
    id: string;
    name: string;
}