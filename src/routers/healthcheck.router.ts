import { Request, Response, Router, NextFunction } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response, _next: NextFunction) => {
    res.status(200).send();
});

export default router;
