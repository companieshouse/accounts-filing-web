import { Request, Response } from "express";
import { GenericHandler, LocalizedViewData, ViewModel } from "../generic";
import { getLocalesField, addLangToUrl, getLanguageFromRequest } from "../../../utils/localise";
import { PrefixedUrls } from "../../../utils/constants/urls";
import { clearSession, getCompanyNumberFromExtraData } from "../../../utils/session";
import { isBranchRegistrationNumber, isLPNumber, isSLPNumber } from "../../../utils/validate/validate.company.number";

enum CompanyNumberRejectionMessageTypes {
    BR="BR",
    LP="LP",
    SLP="SL"
}

interface CannotFilePackageAccountsForCompanyTypeViewData extends LocalizedViewData {
    CompanyNumberRejectionMessageTypes: typeof CompanyNumberRejectionMessageTypes;
    errorMessageCategory: CompanyNumberRejectionMessageTypes;
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

    private getErrorMessageCategory(companyNumber: string): CompanyNumberRejectionMessageTypes {
        if (isBranchRegistrationNumber(companyNumber)) {
            return CompanyNumberRejectionMessageTypes.BR;
        } else if (isLPNumber(companyNumber)) {
            return CompanyNumberRejectionMessageTypes.LP;
        } else if (isSLPNumber(companyNumber)) {
            return CompanyNumberRejectionMessageTypes.SLP;
        } else {
            throw new Error(`Cannot map company type to enum value, bad state - the number ${companyNumber} matches no enum values?`);
        }
    }

    execute(req: Request, _res: Response): ViewModel<CannotFilePackageAccountsForCompanyTypeViewData> {
        this.populateViewData(req);
        const language = getLanguageFromRequest(req);
        const companySearchUrl = addLangToUrl(PrefixedUrls.COMPANY_SEARCH, language);
        const companyNumber = getCompanyNumberFromExtraData(req.session);
        if (companyNumber === undefined) {
            throw new Error("No company number in session however page is for company number of invalid type implying company number must exist");
        }

        clearSession(req.session);
        return {
            templatePath: CannotFilePackageAccountsForCompanyTypeHandler.routeViews,
            viewData: {
                ...this.baseViewData,
                title: getLocalesField("cannot_file_package_accounts_for_company_type_title", req),
                chooseDifferentCompanyUrl: companySearchUrl,
                CompanyNumberRejectionMessageTypes: CompanyNumberRejectionMessageTypes,
                errorMessageCategory: this.getErrorMessageCategory(companyNumber)
            }
        };
    }
}
