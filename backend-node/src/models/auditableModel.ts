export class Auditable {
  /**
   *
   */
  constructor(userName?: string) {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.createdBy = userName ?? 'admin';
    this.updatedBy = userName ?? 'admin';
  }
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}