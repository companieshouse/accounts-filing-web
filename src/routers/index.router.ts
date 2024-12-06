import { Request, Response, Router, NextFunction } from "express";
import { HomeHandler } from "./handlers/index/home";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new HomeHandler(req);
    const params = handler.execute(req, res);
    const { templatePath, viewData } = params;
    if (templatePath && viewData) {
        viewData.companyNumber = typeof viewData.companyNumber === "string" ? viewData.companyNumber : "";
        res.render(templatePath, viewData);
    } else {
        res.status(400).send("Invalid parameters");
    }
});

export default router;
