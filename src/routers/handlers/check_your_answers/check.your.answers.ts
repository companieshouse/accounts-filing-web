import { Request, Response } from "express";
import { BaseViewData, GenericHandler } from "./../generic";
import { createAndLogError, logger } from "../../../utils/logger";
import { TransactionService } from "../../../services/external/transaction.service";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { getCompanyNumber, getPackageType, getValidationResult, must } from "../../../utils/session";
import { getAccountsType } from "../../../utils/constants/paymentTypes";
import { Session } from "@companieshouse/node-session-handler";
import { getAccountsFilingId, getTransactionId } from "../../../utils/session";
import { startPaymentsSession } from "../../../services/external/payment.service";
import { ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { Payment } from "@companieshouse/api-sdk-node/dist/services/payment";

interface CheckYourAnswersViewData extends BaseViewData {
    fileName: string
    typeOfAccounts: string
    changeTypeOfAccountsUrl: string
}

export class CheckYourAnswersHandler extends GenericHandler {
    constructor() {
        super({
            title: "Check your answers – File package accounts with Companies House – GOV.UK",
            backURL: null,
        });
    }


    async executeGet(
        req: Request,
        _response: Response
    ): Promise<CheckYourAnswersViewData> {
        super.populateViewData(req);
        const accountsTypeFullName = this.getAccountsTypeFullName(req.session);

        const validationStatus = must(getValidationResult(req.session));
        this.baseViewData.backURL = `${PrefixedUrls.UPLOADED}/${validationStatus.fileId}`;

        const companyNumber = must(getCompanyNumber(req.session));

        return {
            ...this.baseViewData,
            changeTypeOfAccountsUrl: `${PrefixedUrls.UPLOAD}?companyNumber=${companyNumber}`,
            fileName: validationStatus.fileName,
            typeOfAccounts: accountsTypeFullName
        };
    }


    async executePost(req: Request, _res: Response) {
        if (req.session === undefined) {
            throw createAndLogError("File uploaded POST. Request session is undefined. Unable to close transaction.");
        }

        const transactionService = new TransactionService(req.session);
        const paymentUrl: string | undefined = await transactionService.closeTransaction();

        if (!paymentUrl) {
            logger.debug(`No payment url ${paymentUrl} from closeTransaction, journey redirected to confirmation page`);
            return PrefixedUrls.CONFIRMATION;
        } else {
            // Payment required, start the payment journey
            logger.debug(`Received payment url ${paymentUrl} from closeTransaction, payment journey started`);
            const paymentResponse: ApiResponse<Payment> = await startPaymentsSession(req.session, paymentUrl,
                                                                                     must(getAccountsFilingId(req.session)), must(getTransactionId(req.session)));
            if (!paymentResponse.resource) {
                throw createAndLogError("No resource in payment response");
            } else {
                logger.debug(`Redirecting to payment URL : ${paymentResponse.resource.links.journey}`);
                return paymentResponse.resource.links.journey;
            }
        }
    }

    private getAccountsTypeFullName(session: Session | undefined) {
        const typeOfAccounts = must(getPackageType(session));
        const accountsType = getAccountsType(typeOfAccounts);
        if (accountsType === undefined) {
            throw createAndLogError(`Failed to match ${typeOfAccounts} to a known accounts type.`);
        }
        return accountsType.description;
    }
}
