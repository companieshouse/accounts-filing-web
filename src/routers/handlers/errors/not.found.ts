import { Request, Response } from "express";

export const pageNotFound = (_req: Request, res: Response) => {
    return res.status(404).render("partials/error_404");
};
