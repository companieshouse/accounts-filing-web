import { Request, Response, Router, NextFunction } from "express";
import { submitUrl } from "../utils/constants/urls";
import { SubmitHandler } from "./handlers/submit/submit";

const router: Router = Router();

router.get(`${submitUrl}`, (req: Request, res: Response, _next: NextFunction) => {
    const submitHandler = new SubmitHandler();
    res.redirect(submitHandler.execute(req, res ));
});

export default router;
