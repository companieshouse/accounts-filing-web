import { Request, Response, Router } from "express";
import { HomeHandler } from "./handlers/index/home";

const router = Router({ mergeParams: true });

router.get("/",  (req: Request, res: Response) => {
    const handler = new HomeHandler(req);
    const params = handler.execute(req, res);
    if (params.templatePath && params.viewData) {
        res.render(params.templatePath, params.viewData);
    }
});

export default router;
