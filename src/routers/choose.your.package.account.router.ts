import { Router, Response, Request } from "express";
import { handleExceptions } from "../utils/error.handler";
import { ChooseYourPackageAccountHandler } from "./handlers/choose_your_package_account/choose.your.package.account";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new ChooseYourPackageAccountHandler();
    const viewData = await handler.execute(req, res);
    res.render("router_views/choose_your_package_accounts/choose_your_package_accounts", viewData);
}));

export default router;
