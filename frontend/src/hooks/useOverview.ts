import { useEffect, useState } from "react";
import * as overviewDataSource from '../data/overviewDataSource';

export function useMensualStats(month: number, year: number, refreshKey?: number) {
  const [total, setTotal] = useState<number>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    overviewDataSource
      .getStats(year, month)
      .then(setTotal)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [month, year, refreshKey]);

  return { total, loading, error };
}