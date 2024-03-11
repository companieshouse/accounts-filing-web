import { Request, Response, Router } from "express";
import { handleExceptions } from "../utils/error.handler";
import { CheckYourAnswersHandler } from "./handlers/check_your_answers/check.your.answers";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new CheckYourAnswersHandler();
    const viewData = await handler.executeGet(req, res);
    res.render("router_views/check_your_answers/check_your_answers.njk", viewData);
}));

router.post('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new CheckYourAnswersHandler();
    const nextPage = await handler.executePost(req, res);
    res.redirect(nextPage);
}));

export default router;