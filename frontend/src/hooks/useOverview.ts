import { useEffect, useState } from 'react';
import * as overviewDataSource from '../data/overviewDataSource';
import type { Stats } from '../models/overview';

export function useMensualStats(month: number, year: number, refreshKey?: number) {
  const [stats, setStats] = useState<Stats>({
    income: 0,
    expenses: 0,
    savings: 0,
    budget: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    overviewDataSource
      .getStats(year, month)
      .then(setStats)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [month, year, refreshKey]);

  return { stats, loading, error };
}
