import { Request, Response, Router } from "express";
import { handleExceptions } from "../utils/error.handler";
import { CannotFilePackageAccountsForCompanyTypeHandler } from "./handlers/cannot_file_package_accounts_for_company_type/cannot.file.package.accounts.for.company.type";

const router: Router = Router();

router.get("/", handleExceptions(async (req: Request, res: Response) => {
    const handler = new CannotFilePackageAccountsForCompanyTypeHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
}));

export default router;
