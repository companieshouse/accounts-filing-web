import { Request, Response } from "express";
import { GenericHandler, LocalizedViewData, ViewModel } from "../generic";
import { getLocalesField, addLangToUrl, getLanguageFromRequest } from "../../../utils/localise";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { clearSession } from "../../../utils/session";

interface CannotFileFullAccountsForCompanyTypeViewData extends LocalizedViewData {
    guidanceUrl: string;
    chooseDifferentCompanyUrl: string;
}

export class CannotFileFullAccountsForCompanyTypeHandler extends GenericHandler {
    static routeViews = "router_views/cannot_file_full_accounts_for_company_type/cannot_file_full_accounts_for_company_type";

    constructor () {
        super({
            viewName: "cannot file full accounts for company type",
            backURL: null,
            userEmail: null
        });
    }

    execute(req: Request, _res: Response): ViewModel<CannotFileFullAccountsForCompanyTypeViewData> {
        this.populateViewData(req);
        clearSession(req.session);
        const language = getLanguageFromRequest(req);
        const companySearchUrl = addLangToUrl(PrefixedUrls.COMPANY_SEARCH, language);

        this.baseViewData.backURL = companySearchUrl;

        return {
            templatePath: CannotFileFullAccountsForCompanyTypeHandler.routeViews,
            viewData: {
                ...this.baseViewData,
                title: getLocalesField("cannot_file_full_accounts_for_company_type_title", req),
                guidanceUrl: "https://www.gov.uk/guidance/file-accounts-in-the-uk-as-an-overseas-company",
                chooseDifferentCompanyUrl: companySearchUrl
            }
        };
    }
}
