import { Request, Response, Router } from "express";
import { HomeHandler } from "./handlers/index/home";

const router = Router();

function renderHomePage(req: Request, res: Response) {
    const handler = new HomeHandler(req);
    const params = handler.execute(req, res);
    if (params.templatePath && params.viewData) {
        res.render(params.templatePath, params.viewData);
    }
}

router.get("/",  renderHomePage);
router.get("/company/:companyNumber",  renderHomePage);

export default router;
