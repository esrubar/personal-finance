export const get = async (req: any, res: any) => {
  const user = req.session.user;
  const dashboardData = await getDashboardDataForUser(user.name);
  res.status(200).json({ message: 'Dashboard data' });
};
