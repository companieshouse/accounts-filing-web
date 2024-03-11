import { logger } from "../../../utils/logger";
import { GenericHandler } from "../generic";
import { env } from "../../../config";
import {
    fileIdPlaceholder,
    servicePathPrefix,
    uploadedUrl,
} from "../../../utils/constants/urls";
import { Request, Response } from "express";
import { ContextKeys } from "../../../utils/constants/context.keys";
import { AccountsFilingService } from "../../../services/external/accounts.filing.service";

export class SubmitHandler extends GenericHandler {
    constructor(private accountsFilingService: AccountsFilingService) {
        super({
            title: "",
            backURL: servicePathPrefix,
        });
    }

    async execute(req: Request, _res: Response): Promise<string> {
        logger.info(`GET Request to send fileId call back address`);

        const companyNumber = req.session?.data.signin_info?.company_number;
        if (companyNumber === undefined) {
            throw new Error("Company number in undefined");
        }

        const transactionId = req.session?.getExtraData<string>(
            ContextKeys.TRANSACTION_ID
        );
        if (transactionId === undefined) {
            throw new Error("transaction Id in undefined");
        }

        try {
            const result = await this.accountsFilingService.checkCompany(
                companyNumber,
                transactionId
            );
            if (result.httpStatusCode !== 200) {
                logger.error(`check company failed. ${JSON.stringify(result, null, 2)}`);
                throw result;
            }

            req.session?.setExtraData(
                ContextKeys.ACCOUNTS_FILING_ID,
                result.resource?.accountsFilingId
            );
        } catch (error) {
            logger.error(`Exception returned from SDK while confirming company for company number - [${companyNumber}]. Error: ${JSON.stringify(error, null, 2)}`);
            throw error;
        }

        return getFileUploadUrl(req);
    }
}

export function getFileUploadUrl(req: Request): string {
    const zipPortalBaseURL = `${req.protocol}://${req.get("host")}`;
    const zipPortalCallbackUrl = encodeURIComponent(
        `${zipPortalBaseURL}${servicePathPrefix}${uploadedUrl}/${fileIdPlaceholder}`
    );
    const xbrlValidatorBackUrl = encodeURIComponent(zipPortalBaseURL + servicePathPrefix);

    return `${env.SUBMIT_VALIDATION_URL}?callback=${zipPortalCallbackUrl}&backUrl=${xbrlValidatorBackUrl}`;
}

// TODO: remove before committing
// async function testPopulate(req: Request) {
//     const companyNumber = "0064000";
//     // TODO: remove befire committing. Just creating a dumy transaction to test closing.
//     const ts = new TransactionService(req.session!);
//     const resp = await ts.postTransactionRecord(companyNumber, "reference", "description");

//     const accountsFilingId = "65e847f791418a767a51ce5d";
//     req.session?.setExtraData(ContextKeys.ACCOUNTS_FILING_ID, accountsFilingId);
//     const transactionId = resp.id ?? "NO ID";
//     req.session?.setExtraData<string>(ContextKeys.TRANSACTION_ID, transactionId);


//     // @ts-expect-error Override company number
//     req.session?.data.signin_info?.company_number = companyNumber;

//     // Add resource
//     await makeApiCall(req.session!, async apiClient => {
//         return await apiClient.transaction.putTransaction({
//             reference: "reference",
//             description: "description",
//             id: transactionId,
//             companyNumber: companyNumber,
//             resources: {
//                 "testResource": {
//                     kind: "test",
//                     links: {
//                         resource: ""
//                     }
//                 }
//             }
//         });
//     });
// }

// export interface Transaction {
//     id?: string;
//     etag?: string;
//     links?: {
//         self: string;
//     };
//     reference: string;
//     status?: string;
//     kind?: string;
//     companyName?: string;
//     companyNumber?: string;
//     createdAt?: string;
//     createdBy?: {
//         language: string;
//         id: string;
//         email: string;
//     };
//     updatedAt?: string;
//     description: string;
//     resources?: {
//         [key: string]: {
//             kind: string;
//             links: {
//                 resource: string;
//                 costs?: string;
//             };
//         };
//     };
// }
