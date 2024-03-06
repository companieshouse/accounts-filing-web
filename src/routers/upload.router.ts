import { Request, Response, Router, NextFunction } from "express";
import { UploadHandler } from "./handlers/upload/upload";
import { createOAuthApiClient } from "../services/internal/api.client.service";
import { TransactionService } from "../services/external/transaction.service";

const router: Router = Router();

router.get('/', async (req: Request, res: Response, _next: NextFunction) => {
    const uploadHandler = new UploadHandler(new TransactionService(createOAuthApiClient(req.session)));
    const validatorRedirectUrl = await uploadHandler.execute(req, res);
    res.redirect(validatorRedirectUrl);
});

export default router;
