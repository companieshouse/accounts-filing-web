import { Request, Response, Router } from "express";
import { handleExceptions } from "../utils/error.handler";
import { BeforeYouFilePackageAccountsHandler } from "./handlers/before_you_file_package_accounts/before.you.file.package.accounts";

const router = Router({ mergeParams: true });

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new BeforeYouFilePackageAccountsHandler();
    const { templatePath, viewData } = handler.execute(req, res);
    res.render(templatePath, viewData);
}));

router.post('/', handleExceptions(async (req, res) => {
    const handler = new BeforeYouFilePackageAccountsHandler();
    handler.executePost(req, res);
}));

export default router;
