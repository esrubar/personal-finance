export const getDashboardData = async (userName: string) => {
  const categoryBudgetData = {
    ...data,
    auditable: createAuditable(userName),
  };
  return await CategoryBudgetModel.create(categoryBudgetData);
};