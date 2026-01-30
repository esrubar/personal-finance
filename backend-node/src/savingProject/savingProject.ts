export interface SavingProject {
    amount: number;
    goal?: number;
    auditable: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}