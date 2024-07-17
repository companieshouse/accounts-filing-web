import { Request, Response } from "express";
import { GenericHandler } from "./../generic";
import { createAndLogError, logger } from "../../../utils/logger";
import { PrefixedUrls } from "../../../utils/constants/urls";

export class PaymentCallbackHandler extends GenericHandler {
    constructor() {
        super({
            title: "Payment Callback – GOV.UK",
            viewName: "payment callback"
            backURL: null,
        });
    }

    async executeGet(
        req: Request,
        _response: Response) {
        const paymentStatus = req.query.status;
        const returnedState = req.query.state;
        const savedState = req.session?.getExtraData("payment-nonce");
        if (!savedState || savedState !== returnedState) {
            throw createAndLogError(`Returned state: ${returnedState}, saved state: ${savedState}`);
        }

        if (paymentStatus === "paid") {
            logger.info(`Payment status: ${paymentStatus} - Payment successful redirecting to the submission page`);
            return PrefixedUrls.CONFIRMATION;
        } else {
            logger.info(`Payment status: ${paymentStatus} - Payment failed redirecting to the check your answers page`);
            return PrefixedUrls.CHECK_YOUR_ANSWERS;
        }
    }
}
