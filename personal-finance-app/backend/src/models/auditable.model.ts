export class Auditable {
  /**
   *
   */
  constructor() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.createdBy = 'system';
    this.updatedBy = 'system';
  }
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}