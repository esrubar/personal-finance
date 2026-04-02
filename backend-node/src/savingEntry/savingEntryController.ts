import {Response} from "express";
import * as savingProjectService from "../savingEntry/savingEntryService";

export const create = async (req: any, res: Response) => {
    const user = req.session.user;
    const savingProject = await savingProjectService.createSavingEntry(req.body, user.name);
    res.status(201).json(savingProject);
};
