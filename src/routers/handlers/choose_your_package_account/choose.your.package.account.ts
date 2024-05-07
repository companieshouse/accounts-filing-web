import { PrefixedUrls } from "../../../utils/constants/urls";
import { getCompanyNumber } from "../../../utils/session";
import { BaseViewData, GenericHandler } from "../generic";
import { Request, Response } from "express";
import { PackageAccountType, getPackageItems } from "../../../utils/constants/packageAccounts";

interface ChooseYourPackageAccountViewData extends BaseViewData {
    packageAccounts: Array<PackageAccountType>
}

export class ChooseYourPackageAccountHandler extends GenericHandler {

    constructor() {
        super({
            title: "What package accounts are you submitting?",
            backURL: null
        });
    }

    async execute(
        req: Request,
        _response: Response
    ): Promise<ChooseYourPackageAccountViewData> {
        super.populateViewData(req);
        const companyNumber = getCompanyNumber(req.session);
        const packageAccounts = getPackageItems();
        this.baseViewData.backURL = `${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=${companyNumber}`;

        return {
            ...this.baseViewData,
            packageAccounts
        };
    }
}
