import { Request, Response, Router } from "express";
import { handleExceptions } from "../utils/error.handler";
import { CannotFileFullAccountsForCompanyTypeHandler } from "./handlers/cannot_file_full_accounts_for_company_type/cannot.file.full.accounts.for.company.type";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new CannotFileFullAccountsForCompanyTypeHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
}));

export default router;
