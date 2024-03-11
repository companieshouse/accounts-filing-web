import { Request, Response } from "express";
import { BaseViewData, GenericHandler } from "./../generic";
import { createAndLogError } from "../../../utils/logger";
import { TransactionService } from "../../../services/external/transaction.service";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { getValidationResult, must } from "../../../utils/session";

interface CheckYourAnswersViewData extends BaseViewData {
    fileName: string
    typeOfAccounts: string
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

        const validationStatus = must(getValidationResult(req.session));
        this.baseViewData.backURL = `${PrefixedUrls.UPLOADED}/${validationStatus.fileId}`;

        return {
            ...this.baseViewData,
            fileName: validationStatus.fileName,
            typeOfAccounts: "Placeholder" // TODO: This needs to be replaced by a value representing what the user chose at the type of accounts page.
        };
    }

    async executePost(req: Request, _res: Response) {
        if (req.session === undefined) {
            throw createAndLogError("File uploaded POST. Request session is undefined. Unable to close transaction.");
        }

        const transactionService = new TransactionService(req.session);
        await transactionService.closeTransaction();

        const nextPage = PrefixedUrls.CONFIRMATION;
        return nextPage;
    }
}
