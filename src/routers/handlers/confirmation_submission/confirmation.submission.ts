import { BaseViewData, GenericHandler } from "../generic";
import { Request, Response } from "express";
import { getAccountsFilingId, getCompanyName, getCompanyNumber, getPackageType, getUserProfile, must } from "../../../utils/session";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { getAccountsType } from "../../../utils/constants/PackageTypeDetails";

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
            backURL: null
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
        const userEmail = getUserProfile(req.session)?.email;
        const packageType = must(getPackageType(req.session));

        if (typeof packageType === "undefined") {
            throw new Error(`PackageType: ${packageType} is not supported at the moment`);
        }
        const payment = getAccountsType(packageType).fee;

        const props: Record<string, string | Error> = { companyName, companyNumber, accountsFilingId };

        if (typeof userEmail === "undefined") {
            this.baseViewData.errors["userEmail"] = new Error("User Email is not defined");
        }

        for (const key in props) {
            if (props[key] instanceof Error){
                this.baseViewData.errors[key] = (props[key]);
            }
        }

        this.setTableRows(payment, {
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

    setTableRows(payment: string, companyProfile: {companyName: string, companyNumber: string}): void{
        ConfirmationSubmissionHandler.rows = [
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
            ConfirmationSubmissionHandler.rows.push(
                [
                    { text: "Payment received" },
                    { text: `£${payment}` }
                ]
            );
        }
    }
}


