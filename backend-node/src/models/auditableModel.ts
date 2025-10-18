export class Auditable {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy?: string;

    /**
     *
     */
    constructor() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.createdBy = 'system';
        this.updatedBy = 'system';
    }
}