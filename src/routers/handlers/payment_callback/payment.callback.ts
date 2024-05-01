import { Request, Response } from "express";
import { GenericHandler } from "./../generic";
import { createAndLogError, logger } from "../../../utils/logger";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { must } from "../../../utils/session";
import { getAccountsFilingId } from "../../../utils/session";
import { Session } from "@companieshouse/node-session-handler";

export class PaymentCallbackHandler extends GenericHandler {
    constructor() {
        super({
            title: "Payment Callback – GOV.UK",
            backURL: null,
        });
    }

    async executeGet(
      req: Request,
      _response: Response) {
        const session = req.session as Session;
        const paymentStatus = req.query.status;
        const accountsFilingId = must(getAccountsFilingId(req.session));
        const returnedState = req.query.state;
        const savedState = session.getExtraData("payment-nonce");
        if (!savedState || savedState !== returnedState) {
          throw createAndLogError(`Returned state: ${returnedState}, saved state: ${savedState}`);
        }
    
        if (paymentStatus === "paid") {
          logger.info("Accounts filing id: " + accountsFilingId + " - Payment status: " + paymentStatus + " - redirecting to the submission page");
          return PrefixedUrls.CONFIRMATION
        } else {
          logger.info("Accounts filing id: " + accountsFilingId + " - Payment status: " + paymentStatus + " - redirecting to the check your answers page");
          return PrefixedUrls.CHECK_YOUR_ANSWERS;
        }
    }
}