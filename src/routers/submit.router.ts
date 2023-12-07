import { Request, Response, Router, NextFunction } from "express";
import { SubmitHandler } from "./handlers/submit/submit";

const router: Router = Router();

router.get('/', (req: Request, res: Response, _next: NextFunction) => {
    const submitHandler = new SubmitHandler();
    const callbackUrl = submitHandler.execute(req, res);
    res.redirect(callbackUrl);
});

export default router;
