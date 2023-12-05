import { Request, Response, Router, NextFunction } from "express";
import { submitUrl } from "../utils/constants/urls";
import { SubmitHandler } from "./handlers/submit/submit";

const router: Router = Router();

router.get(`${submitUrl}`, async (req: Request, res: Response, _next: NextFunction) => {
    const submitHandler = new SubmitHandler();
    res.redirect(await submitHandler.execute(req, res ));
});

export default router;
