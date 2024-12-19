import { Request, Response } from "express";
import { BaseViewData, GenericHandler, Redirect, ViewModel } from "./../generic";
import { logger } from "../../../utils/logger";
import { addLangToUrl, selectLang } from "../../../utils/localise";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { ValidateCompanyNumberFormat } from "../../../utils/validate/validate.company.number";
import { setCompanyName, setExtraDataCompanyNumber } from "../../../utils/session";
import { getCompanyProfile } from "../../../services/external/company.profile.service";

export class BeforeYouFilePackageAccountsHandler extends GenericHandler {
    static routeViews: string = "router_views/before_you_file_package_accounts/before_you_file_package_accounts";

    constructor () {
        super({
            title: "Before you file package accounts – File package accounts with Companies House – GOV.UK",
            viewName: "before you file",
            backURL: null
        });
    }

    execute (req: Request, _res: Response): ViewModel<BaseViewData> {
        logger.info(`GET request to serve before you file package accounts page`);
        return { 
            templatePath: BeforeYouFilePackageAccountsHandler.routeViews, 
            viewData: {
                ...this.baseViewData,
                nextURL: req.originalUrl as string, 
            }
        };
    }

    async executePost(req: Request, res: Response): Promise<Redirect> {
        const companyNumber = req.params.companyNumber as string | undefined;
        const companySearchUrl = addLangToUrl(PrefixedUrls.COMPANY_SEARCH, selectLang(req.query.lang));
        if (companyNumber === undefined || !ValidateCompanyNumberFormat.isValid(companyNumber)) {
            return { url: companySearchUrl};
        }

        if (req.session === undefined) {
            logger.error(`Error redirecting directly to choose accounts page. No session to store company number in. Redirecting to Company search`);
            return { url: companySearchUrl};
        }

        setExtraDataCompanyNumber(req.session, companyNumber);
        const companyProfile = await getCompanyProfile(req, companyNumber);
        setCompanyName(req.session, companyProfile.companyName);

        const choosePackageAccountUrl = addLangToUrl(PrefixedUrls.CHOOSE_YOUR_ACCOUNTS_PACKAGE, selectLang(req.query.lang));
        return { url: choosePackageAccountUrl };
    }
}