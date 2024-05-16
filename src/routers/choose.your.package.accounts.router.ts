import { Router, Response, Request } from "express";
import { handleExceptions } from "../utils/error.handler";
import { ChooseYourPackageAccountsHandler } from "./handlers/choose_your_package_accounts/choose.your.package.accounts";
import { executeViewModel, isRedirect } from "./handlers/generic";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new ChooseYourPackageAccountsHandler();
    const viewModel = await handler.executeGet(req, res);
    executeViewModel(res, viewModel);
}));

router.post('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new ChooseYourPackageAccountsHandler();
    const handlerResult = await handler.executePost(req, res);

    if (isRedirect(handlerResult)) {
        res.redirect(handlerResult.url);
    } else {
        executeViewModel(res, handlerResult);
    }
}));

export default router;
