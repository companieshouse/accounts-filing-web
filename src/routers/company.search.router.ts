import { NextFunction, Router, Request, Response } from "express";
import { CompanySearchHandler as CompanySearchHandler } from "./handlers/company/search/search";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    const handler = new CompanySearchHandler();
    const params = handler.execute(req, res);
    if (params.templatePath && params.viewData) {
        res.render(params.templatePath, params.viewData);
    }
})

router.post("/", async (req: Request, res: Response, _next: NextFunction) => {
})

router.get("/:companyId", async (req: Request, res: Response, _next: NextFunction) => {

})

export default router;