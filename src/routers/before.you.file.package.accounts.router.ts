import { Request, Response, Router } from "express";
import { handleExceptions } from "../utils/error.handler";
import { BeforeYouFilePackageAccountsHandler } from "./handlers/before_you_file_package_accounts/before.you.file.package.accounts";
import { PrefixedUrls } from "../utils/constants/urls";
import { addLangToUrl, selectLang } from "../utils/localise";
import { checkCompanyNumberFormatIsValidate } from "../utils/format/company.number.format";
import { ValidateCompanyNumberFormat } from "../utils/validate/validate.company.number";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new BeforeYouFilePackageAccountsHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
}));

router.get('/company/:companyNumber', handleExceptions(async (req: Request, res: Response) => {
    const companyNumber = req.params.companyNumber;
    checkCompanyNumberFormatIsValidate(companyNumber);
    if (ValidateCompanyNumberFormat.isValid(companyNumber)) {
        res.redirect(addLangToUrl(`${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=${companyNumber}`, selectLang(req.query.lang)));
    }
}));

export default router;
