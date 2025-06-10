import { useState, useEffect } from 'react';
import * as savingProjectDataSource from '../data/savingProjectDataSource';
import type { SavingProject } from '../models/savingProject';

export function useSavingProjects(refreshKey?: number) {
  const [savingProjects, setSavingProjects] = useState<SavingProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    savingProjectDataSource.getSavingProjects()
      .then(setSavingProjects)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [refreshKey]);

  return { savingProjects, loading, error };
}

export function useSavingProject(id: string) {
  const [savingProject, setSavingProject] = useState<SavingProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    savingProjectDataSource.getSavingProject(id)
      .then(setSavingProject)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { savingProject, loading, error };
}
