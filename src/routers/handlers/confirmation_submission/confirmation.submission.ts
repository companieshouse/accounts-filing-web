import { BaseViewData, GenericHandler } from "../generic";
import { Request, Response } from "express";
import { getAccountsFilingId, getCompanyName, getCompanyNumber, getPackageType, getUserEmail, must } from "../../../utils/session";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { fees } from "../../../utils/constants/fees";
import { getLocalesField } from "../../../utils/localise";

interface ConfirmationSubmissionViewData extends BaseViewData {
        accountsFilingId: string | Error,
        companyProfile: Pick<CompanyProfile, "companyName" | "companyNumber">
        payment: string
        userEmail: string
        rows: typeof ConfirmationSubmissionHandler.rows
}

export class ConfirmationSubmissionHandler extends GenericHandler{
    constructor() {
        super({
            title: "Accounts Submitted",
            viewName: "accounts submitted",
            backURL: null,
            userEmail: null
        });
    }
    public static rows: Array<Array<{}>>;

    async execute(req: Request, _response: Response
    ): Promise<ConfirmationSubmissionViewData> {

        super.populateViewData(req);

        if (typeof req.session === "undefined"){
            throw new Error("Session not properly set");
        }

        const companyName = getCompanyName(req.session);
        const accountsFilingId = getAccountsFilingId(req.session);
        const companyNumber = getCompanyNumber(req.session);
        const userEmail = getUserEmail(req.session);
        const packageType = must(getPackageType(req.session));

        if (typeof packageType === "undefined") {
            throw new Error(`PackageType: ${packageType} is not supported at the moment`);
        }

        const payment = typeof fees[packageType] !== 'string' ? '-' : `${fees[packageType]}`;

        const props: Record<string, string | Error> = { companyName, companyNumber, accountsFilingId };

        if (typeof userEmail === "undefined") {
            this.baseViewData.errors["userEmail"] = new Error("User Email is not defined");
        }

        for (const key in props) {
            if (props[key] instanceof Error){
                this.baseViewData.errors[key] = (props[key]);
            }
        }

        this.setTableRows(payment, req, {
            companyName: companyName as string,
            companyNumber: companyNumber as string,
        });

        return {
            ...this.baseViewData,
            accountsFilingId,
            companyProfile: {
                companyName: companyName as string,
                companyNumber: companyNumber as string,
            },
            payment,
            userEmail: userEmail as string,
            rows: ConfirmationSubmissionHandler.rows
        };
    }

    setTableRows(payment: string, req: Request, companyProfile: {companyName: string, companyNumber: string}): void{
        ConfirmationSubmissionHandler.rows = [
            [
                { text: getLocalesField("company_number", req) },
                { text: companyProfile.companyNumber }
            ],
            [
                { text: getLocalesField("company_name", req) },
                { text: companyProfile.companyName }
            ]
        ];

        if (payment !== "-") {
            ConfirmationSubmissionHandler.rows.push(
                [
                    { text: getLocalesField("payment_received", req)  },
                    { text: `£${payment}` }
                ]
            );
        }
    }
}


