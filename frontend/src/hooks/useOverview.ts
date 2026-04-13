import { useEffect, useState } from 'react';
import * as overviewDataSource from '../data/overviewDataSource';
import type { OverviewData } from '../models/overview';

export function useMensualStats(month: number, year: number, refreshKey?: number) {
  const [overviewData, setOverviewData] = useState<OverviewData>({
    stats: {
      income: 0,
      expenses: 0,
      savings: 0,
      budget: 0,
    },
    evolution: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    overviewDataSource
      .getStats(year, month)
      .then(setOverviewData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [month, year, refreshKey]);

  return { overviewData, loading, error };
}
