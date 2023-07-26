import { Request, Response } from "express";
import { Templates } from "../types/template.paths";

export const get = (req: Request, res: Response) => {
  const CHS_URL = process.env.CHS_URL;
  const PIWIK_START_GOAL_ID = process.env.PIWIK_START_GOAL_ID;
  
  return res.render(Templates.START, { CHS_URL,
    PIWIK_START_GOAL_ID,
    templateName: Templates.START });
};