import {useState} from "react";
import * as savingEntryDataSource from "../data/savingEntriesDataSource.ts";
import type {SavingEntry} from "../models/savingEntries.ts";

export function useCreateSavingEntry() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createSavingEntry = async (savingEntry: SavingEntry) => {
        setLoading(true);
        setError(null);
        try {
            return await savingEntryDataSource.createSavingEntry(savingEntry);
        } catch (err: any) {
            setError(err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { createSavingProject: createSavingEntry, loading, error };
}