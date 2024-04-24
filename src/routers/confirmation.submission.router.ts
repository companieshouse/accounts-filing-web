
import { handleExceptions } from "../utils/error.handler";
import { ConfirmationSubmissionHandler } from "./handlers/confirmation_submission/confirmation.submission";
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const handler = new ConfirmationSubmissionHandler();
    const viewData = await handler.execute(req, res);

    if (Object.entries(viewData.errors).length !== 0){
        throw viewData.errors[Object.keys(viewData.errors)[0]];
    }

    res.render("router_views/accounts_submitted/accounts_submitted", viewData);
}));

export default router;
