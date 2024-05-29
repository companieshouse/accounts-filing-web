import { Request, Response, Router, NextFunction } from "express";
import { UploadHandler } from "./handlers/upload/upload";
import { TransactionService } from "../services/external/transaction.service";
import { handleExceptions } from "../utils/error.handler";
import { AccountsFilingService } from "../services/external/accounts.filing.service";

const router: Router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const transactionService = new TransactionService(req.session!);
    const accountsFilingService = new AccountsFilingService(req.session!);
    const uploadHandler = new UploadHandler(accountsFilingService, transactionService);
    const validatorRedirectUrl = await uploadHandler.execute(req, res);
    res.redirect(validatorRedirectUrl);
}));

export default router;
