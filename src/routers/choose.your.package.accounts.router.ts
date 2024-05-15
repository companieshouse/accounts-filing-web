import { Router, Response, Request } from "express";
import { handleExceptions } from "../utils/error.handler";
import { ChooseYourPackageAccountsHandler } from "./handlers/choose_your_package_accounts/choose.your.package.accounts";
import { PrefixedUrls } from "../utils/constants/urls";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new ChooseYourPackageAccountsHandler();
    const viewData = await handler.executeGet(req, res);
    res.render("router_views/choose_your_package_accounts/choose_your_package_accounts", viewData);
}));

router.post('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new ChooseYourPackageAccountsHandler();
    const viewData = await handler.executePost(req, res);

    if (Object.entries(viewData.errors).length > 0){
        throw viewData.errors.packageAccountsError;
    }

    res.redirect(PrefixedUrls.UPLOAD);
}));

export default router;