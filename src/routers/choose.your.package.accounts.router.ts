import { Router, Response, Request } from "express";
import { handleExceptions } from "../utils/error.handler";
import { ChooseYourPackageAccountsHandler } from "./handlers/choose_your_package_accounts/choose.your.package.accounts";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new ChooseYourPackageAccountsHandler();
    const viewData = await handler.executeGet(req, res);
    res.render(viewData.template, viewData);
}));

router.post('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new ChooseYourPackageAccountsHandler();
    const nextPage = await handler.executePost(req, res);

    if (typeof nextPage === "string"){
        const viewData = await handler.executeGet(req, res);
        res.render(nextPage, viewData);
    } else {res.redirect(nextPage.redirect);}
}));

export default router;
