import { Types } from 'mongoose';

export const isObjectId = (id: string): id is string => {
  return Types.ObjectId.isValid(id);
};
