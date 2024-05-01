import { Request, Response, Router } from "express";
import { handleExceptions } from "../utils/error.handler";
import { PaymentCallbackHandler } from "./handlers/payment_callback/payment.callback";

const router = Router();

router.get('/', handleExceptions(async (req: Request, res: Response) => {
    const handler = new PaymentCallbackHandler();
    const nextPage = await handler.executeGet(req, res);
    res.redirect(nextPage);
}));

export default router;