export const excludeProjectExpenses = () => ({
  $or: [{ projectId: { $exists: false } }, { projectId: null }],
});
