export interface SavingProject {
  amount: number;
  goal?: number;
  name: string;
  status: 'active' | 'completed' | 'paused';
  auditable: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}
