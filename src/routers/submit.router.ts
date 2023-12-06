import { Request, Response, Router, NextFunction } from "express";
import { submitUrl } from "../utils/constants/urls";
import { SubmitHandler } from "./handlers/submit/submit";

const router: Router = Router();

router.get(`${submitUrl}`, (req: Request, res: Response, _next: NextFunction) => {
    const submitHandler = new SubmitHandler();
    const params = submitHandler.execute(req, res );
    if (params.callbackUrl){
        res.redirect(params.callbackUrl);
    }
});

export default router;
