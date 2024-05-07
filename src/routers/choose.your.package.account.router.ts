import { Router, Response, Request } from "express";
import { handleExceptions } from "../utils/error.handler";
import { ChooseYourPackageAccountHandler } from "./handlers/choose_your_package_account/choose.your.package.account";
import { Urls } from "../utils/constants/urls";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new ChooseYourPackageAccountHandler();
    const viewData = await handler.executeGet(req, res);
    res.render("router_views/choose_your_package_accounts/choose_your_package_accounts", viewData);
}));

router.post('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new ChooseYourPackageAccountHandler();
    const viewData = await handler.executePost(req, res);

    if (Object.entries(viewData.errors).length > 0){
        throw viewData.errors.packageAccount;
    }

    res.redirect(Urls.UPLOAD);
}));

export default router;
