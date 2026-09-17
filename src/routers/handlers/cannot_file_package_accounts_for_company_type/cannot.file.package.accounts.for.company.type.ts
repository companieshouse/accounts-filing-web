import { Request, Response } from "express";
import { GenericHandler, LocalizedViewData, ViewModel } from "../generic";
import { getLocalesField, addLangToUrl, getLanguageFromRequest } from "../../../utils/localise";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { clearSession } from "../../../utils/session";

interface CannotFilePackageAccountsForCompanyTypeViewData extends LocalizedViewData {
    guidanceUrl: string;
    chooseDifferentCompanyUrl: string;
}

export class CannotFilePackageAccountsForCompanyTypeHandler extends GenericHandler {
    static readonly routeViews = "router_views/cannot_file_package_accounts_for_company_type/cannot_file_package_accounts_for_company_type";

    constructor () {
        super({
            viewName: "cannot file package accounts for company type",
            backURL: PrefixedUrls.HOME,
            userEmail: null
        });
    }

    execute(req: Request, _res: Response): ViewModel<CannotFilePackageAccountsForCompanyTypeViewData> {
        this.populateViewData(req);
        clearSession(req.session);
        const language = getLanguageFromRequest(req);
        const companySearchUrl = addLangToUrl(PrefixedUrls.COMPANY_SEARCH, language);

        return {
            templatePath: CannotFilePackageAccountsForCompanyTypeHandler.routeViews,
            viewData: {
                ...this.baseViewData,
                title: getLocalesField("cannot_file_package_accounts_for_company_type_title", req),
                guidanceUrl: "https://www.gov.uk/file-accounts-in-the-uk-as-an-overseas-company",
                chooseDifferentCompanyUrl: companySearchUrl
            }
        };
    }
}
