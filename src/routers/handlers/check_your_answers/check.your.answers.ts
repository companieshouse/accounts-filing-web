import { Request, Response } from "express";
import { BaseViewData, GenericHandler } from "./../generic";
import { createAndLogError } from "../../../utils/logger";
import { TransactionService } from "../../../services/external/transaction.service";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { getPackageType, getValidationResult, must } from "../../../utils/session";
import { getAccountType } from "../../../utils/constants/paymentTypes";
import { constructValidatorRedirect } from "../../../utils/url";
import { Session } from "@companieshouse/node-session-handler";

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
        const xbrlUploadUri = constructValidatorRedirect(req);
        this.baseViewData.backURL = xbrlUploadUri;

        return {
            ...this.baseViewData,
            changeTypeOfAccountsUrl: xbrlUploadUri,
            fileName: validationStatus.fileName,
            typeOfAccounts: accountsTypeFullName
        };
    }


    async executePost(req: Request, _res: Response) {
        if (req.session === undefined) {
            throw createAndLogError("File uploaded POST. Request session is undefined. Unable to close transaction.");
        }

        const transactionService = new TransactionService(req.session);
        await transactionService.closeTransaction();

        return PrefixedUrls.CONFIRMATION;
    }

    private getAccountsTypeFullName(session: Session | undefined) {
        const typeOfAccounts = must(getPackageType(session));
        const accountsType = getAccountType(typeOfAccounts);
        if (accountsType === undefined) {
            throw createAndLogError(`Failed to match ${typeOfAccounts} to a known accounts type.`);
        }
        return accountsType.description;
    }
}
