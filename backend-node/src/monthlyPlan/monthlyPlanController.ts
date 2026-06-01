import { getLastMonthPlan } from './monthlyPlanService';
import { Response } from 'express';

export const getPreviousPlan = async (req: any, res: Response) => {
  const user = req.session.user;

  var overviewParams = {
    month: parseInt(req.params.month),
    year: parseInt(req.params.year),
    userName: user.name,
  };

  const result = await getLastMonthPlan(overviewParams);
  res.json(result);
};
