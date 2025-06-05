import { useState } from 'react';
import * as savingProjectDataSource from '../data/savingProjectDataSource';
import type { SavingProject } from '../models/savingProject';

export function useCreateSavingProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createSavingProject = async (savingProject: SavingProject) => {
    setLoading(true);
    setError(null);
    try {
      const result = await savingProjectDataSource.createSavingProject(savingProject);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createSavingProject, loading, error };
}

export function useUpdateSavingProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateSavingProject = async (id: string, savingProject: SavingProject) => {
    setLoading(true);
    setError(null);
    try {
      const result = await savingProjectDataSource.updateSavingProject(id, savingProject);
      return result;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateSavingProject, loading, error };
}

export function useDeleteSavingProject() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteSavingProject = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await savingProjectDataSource.deleteSavingProject(id);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { deleteSavingProject, loading, error };
}
