import Auditable from '../models/auditable.model';

export const createAuditable = async (data: any) => await Auditable.create(data);
export const getAuditables = async () => await Auditable.find();
export const getAuditableById = async (id: string) => await Auditable.findById(id);
export const updateAuditable = async (id: string, data: any) => await Auditable.findByIdAndUpdate(id, data, { new: true });
export const deleteAuditable = async (id: string) => await Auditable.findByIdAndDelete(id);
