// Domain Interface
export interface Category {
    name: string;
    auditable: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}
