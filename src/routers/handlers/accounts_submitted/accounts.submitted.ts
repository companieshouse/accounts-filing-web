import { BaseViewData, GenericHandler } from "../generic";
import { Request, Response } from "express";
import { getCompanyName, getCompanyNumber, getPackageType, getTransactionId, getUserProfile } from "./../../../utils/session";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { getAccountType } from "./../../../utils/constants/paymentTypes";

interface AccountsSubmittedViewData extends BaseViewData {
        transactionId: string | Error,
        companyProfile: Pick<CompanyProfile, "companyName" | "companyNumber">
        payment: string
        userEmail: string
        rows: typeof AccountsSubmittedHandler.rows
}

export class AccountsSubmittedHandler extends GenericHandler{
    constructor() {
        super({
            title: "Accounts Submitted",
            backURL: null
        });
    }
    public static rows: Array<Array<{}>>;

    async execute(req: Request, _response: Response
    ): Promise<AccountsSubmittedViewData> {

        super.populateViewData(req);

        if (typeof req.session === "undefined"){
            throw new Error("Session not properly set");
        }

        const companyName = getCompanyName(req.session);
        const transactionId = getTransactionId(req.session);
        const companyNumber = getCompanyNumber(req.session);
        const userEmail = getUserProfile(req.session)?.email;
        const packageType = getPackageType(req.session);

        if (typeof packageType === "undefined") {
            throw new Error(`PackageType: ${packageType} is not supported at the moment`);
        }
        const payment = getAccountType(packageType).fee;

        const props: Record<string, string | Error> = { companyName, companyNumber, transactionId };

        if (typeof userEmail === "undefined") {
            this.baseViewData.errors["userEmail"] = new Error("User Email is not defined");
        }

        for (const key in props) {
            if (props[key] instanceof Error){
                this.baseViewData.errors[key] = (props[key] as Error);
            }
        }

        this.setTableRows(payment, {
            companyName: companyName as string,
            companyNumber: companyNumber as string,
        });

        return {
            ...this.baseViewData,
            transactionId,
            companyProfile: {
                companyName: companyName as string,
                companyNumber: companyNumber as string,
            },
            payment,
            userEmail: userEmail as string,
            rows: AccountsSubmittedHandler.rows
        };
    }

    setTableRows(payment: string, companyProfile: {companyName: string, companyNumber: string}): void{
        AccountsSubmittedHandler.rows = [
            [
                { text: "Company number" },
                { text: companyProfile.companyNumber }
            ],
            [
                { text: "Company name" },
                { text: companyProfile.companyName }
            ]
        ];

        if (payment !== "-") {
            AccountsSubmittedHandler.rows.push(
                [
                    { text: "Payment received" },
                    { text: `£${payment}` }
                ]
            );
        }
    }
}


