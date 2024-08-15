import { PrefixedUrls } from "../../../utils/constants/urls";
import { getCompanyNumber, setPackageType } from "../../../utils/session";
import { BaseViewData, GenericHandler, Redirect, ViewModel } from "../generic";
import { Request, Response } from "express";
import { logger } from "../../../utils/logger";
import { isPackageType, PackageType } from "@companieshouse/api-sdk-node/dist/services/accounts-filing/types";
import { getPackageTypeOptionsRadioButtonData } from "./package.type.options";
import errorManifest from "../../../utils/error_manifests/default";
import { packageTypeFieldName } from "./constants";
import { getLocalesField } from "../../../utils/localise";

interface RadioButtonData {
    text: string,
    value: string,
    hint?: {
        text: string
    }
}

interface ChooseYourPackageAccountsViewData extends BaseViewData {
    packageAccountsItems: Array<RadioButtonData>,
    packageType?: PackageType,
    packageTypeFieldName: string
}

const templatePath = "router_views/choose_your_package_accounts/choose_your_package_accounts";

export class ChooseYourPackageAccountsHandler extends GenericHandler {
    constructor() {
        super({
            title: "What package accounts are you submitting?",
            viewName: "choose your package accounts",
            backURL: null
        });
    }

    getViewData(req: Request): ChooseYourPackageAccountsViewData {
        super.populateViewData(req);
        const companyNumber = getCompanyNumber(req.session);

        return {
            ...this.baseViewData,
            title: getLocalesField("choose_your_package_accounts_title", req),
            packageTypeFieldName,
            backURL: `${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=${companyNumber}`,
            packageAccountsItems: getPackageTypeOptionsRadioButtonData(req),
        };
    }

    async executeGet(
        req: Request,
        _response: Response
    ): Promise<ViewModel<ChooseYourPackageAccountsViewData>>{
        logger.info(`Rendering package accounts type chooser page`);

        return {
            templatePath,
            viewData: this.getViewData(req)
        };
    }


    async executePost (
        req: Request,
        _response: Response
    ): Promise<ViewModel<ChooseYourPackageAccountsViewData> | Redirect> {
        logger.info(`Handling post request for package accounts chooser page`);

        const viewData = this.getViewData(req);

        const packageTypeChoice = req.body[packageTypeFieldName];
        logger.debug(`Submitted choice: ${JSON.stringify(packageTypeChoice)}`);

        if (packageTypeChoice !== undefined && isPackageType(packageTypeChoice)){
            setPackageType(req.session, packageTypeChoice);
            return { url: PrefixedUrls.UPLOAD };
        }

        const nothingSelected = errorManifest[packageTypeFieldName].nothingSelected;
        Object.defineProperty(nothingSelected, 'summary', {
            value: getLocalesField("choose_your_package_accounts_error_message", req),
            writable: true,
        }); 

        viewData.errors[packageTypeFieldName] = nothingSelected;

        return {
            templatePath,
            viewData
        };
    }

}
