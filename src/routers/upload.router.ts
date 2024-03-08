import { Request, Response, Router, NextFunction } from "express";
import { UploadHandler } from "./handlers/upload/upload";
import { createOAuthApiClient } from "../services/internal/api.client.service";
import { TransactionService } from "../services/external/transaction.service";
import { handleExceptions } from "../utils/error.handler";

const router: Router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const oauthApiClient = createOAuthApiClient(req.session);
    const transactionService = new TransactionService(oauthApiClient);
    const uploadHandler = new UploadHandler(transactionService);
    const validatorRedirectUrl = await uploadHandler.execute(req, res);
    res.redirect(validatorRedirectUrl);
}));

export default router;
