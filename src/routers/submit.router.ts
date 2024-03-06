import { Request, Response, Router, NextFunction } from "express";
import { SubmitHandler } from "./handlers/submit/submit";
import { defaultAccountsFilingService } from "../services/external/accounts.filing.service";

const router: Router = Router();

router.get('/', async (req: Request, res: Response, _next: NextFunction) => {
    const submitHandler = new SubmitHandler(defaultAccountsFilingService);
    const validatorRedirectUrl = await submitHandler.execute(req, res);
    res.redirect(validatorRedirectUrl);
});

export default router;
