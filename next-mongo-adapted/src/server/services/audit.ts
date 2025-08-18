export function buildAuditable(userId: string) {
  const now = new Date();
  return { createdAt: now, updatedAt: now, createdBy: userId, updatedBy: userId };
}
export function touchAuditable(existing: any, userId: string) {
  return { ...existing, updatedAt: new Date(), updatedBy: userId };
}
