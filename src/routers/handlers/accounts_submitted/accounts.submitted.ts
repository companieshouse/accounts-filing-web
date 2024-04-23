import { BaseViewData, GenericHandler } from "../generic";
import { Request, Response } from "express";
import { getCompanyName, getCompanyNumber, getPaymentType, getTransactionId, getUserProfile } from "./../../../utils/session";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { getPayment } from "./../../../utils/constants/paymentTypes";

interface AccountsSubmittedViewData extends BaseViewData {
        transactionId: string | Error,
        companyProfile: Pick<CompanyProfile, "companyName" | "companyNumber">
        payment: string
        userEmail: string
}

export class AccountsSubmittedHandler extends GenericHandler{
    constructor() {
        super({
            title: "Accounts Submitted",
            backURL: null
        });
    }

    async execute(req: Request, _response: Response
    ): Promise<AccountsSubmittedViewData> {

        super.populateViewData(req);

        if (typeof req.session === "undefined"){
            throw new Error("Session not properly set");
        }

        const companyName = getCompanyName(req.session);
        const transactionId = getTransactionId(req.session);
        const companyNumber = getCompanyNumber(req.session);
        const userEmail = getUserProfile(req.session!)!.email;

        const payment = getPayment(getPaymentType(req.session));

        const props: Record<string, string | Error> = { companyName, companyNumber, transactionId };

        if (typeof userEmail === "undefined") {
            this.baseViewData.errors["userEmail"] = new Error("User Email is not defined");
        }

        for (const key in props) {
            if (props[key] instanceof Error){
                this.baseViewData.errors[key] = (props[key] as Error);
            }
        }

        return {
            ...this.baseViewData,
            transactionId,
            companyProfile: {
                companyName: companyName as string,
                companyNumber: companyNumber as string,
            },
            payment,
            userEmail: userEmail as string
        };
    }
}
