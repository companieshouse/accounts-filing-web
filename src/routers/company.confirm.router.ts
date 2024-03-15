import { Router, Request, Response, NextFunction } from "express";
import { CompanyConfirmHandler } from './handlers/company/confirm/confirm';
import { createOAuthApiClient } from "../services/internal/api.client.service";
import { CompanyProfileService } from "../services/external/company.profile.service";
import { handleExceptions } from "../utils/error.handler";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response, _next: NextFunction) => {
    const oauthApiClient = createOAuthApiClient(req.session);
    const companyProfileService = new CompanyProfileService(oauthApiClient);
    const handler = new CompanyConfirmHandler(companyProfileService);
    const params = await handler.execute(req, res);
    if (params.templatePath && params.viewData) {
        res.render(params.templatePath, params.viewData);
    }
}));

export default router;
