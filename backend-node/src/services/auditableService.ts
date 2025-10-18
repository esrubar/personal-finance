import {Auditable} from "../models/auditableModel";

export const createAuditable = (): Auditable => {
    return new Auditable();
};

export const updateAuditable = (existingAuditable: Auditable): Auditable => {
    return {
        ...existingAuditable,
        updatedBy: 'system',
        updatedAt: new Date(),
    };
};