import { Request, Response, Router, NextFunction } from "express";
import { HomeHandler } from "./handlers/index/home";
import { addLangToUrl, selectLang } from "../utils/localise";
import { PrefixedUrls } from "../utils/constants/urls";
import { ValidateCompanyNumberFormat } from "../utils/validate/validate.company.number";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new HomeHandler(req);
    const params = handler.execute(req, res);
    const { templatePath, viewData } = params;
    if (templatePath && viewData) {
        res.render(templatePath, viewData);
    } else {
        res.status(400).send("Invalid parameters");
    }
});

router.get("/company/:companyNumber", (req: Request, res: Response, _next: NextFunction) => {
    const companyNumber = req.params.companyNumber;
    if (ValidateCompanyNumberFormat.isValid(companyNumber)) {
        res.redirect(addLangToUrl(`/company/${companyNumber}${PrefixedUrls.HOME}`.slice(0, -1), selectLang(req.query.lang)));
    }
});

export default router;
