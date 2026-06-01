import { useEffect, useState } from 'react';
import * as monthlyPlanDataSource from '../data/monthlyPlanDataSource';
import type { LastMonthlyPlanning } from '../models/monthlyPlan';

export function usePreviousPlanning(month: number, year: number, refreshKey?: number) {
  const [previousPlanning, setPreviousPlanning] = useState<LastMonthlyPlanning[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    monthlyPlanDataSource
      .getPreviousPlanning(year, month)
      .then(setPreviousPlanning)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [month, year, refreshKey]);

  return { previousPlanning, loading, error };
}
