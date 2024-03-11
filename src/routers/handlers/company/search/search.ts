import { COMPANY_SEARCH, servicePathPrefix } from "../../../../utils/constants/urls";
import { logger } from "../../../../utils/logger";
import { BaseViewData, GenericHandler, ViewModel } from "../../generic";
import { Request, Response } from "express";


export class CompanySearchHandler extends GenericHandler {

    constructor () {
        super({
            title: "Company search – Accounts Filing – GOV.UK ",
            backURL: servicePathPrefix
        });
    }

    execute (req: Request, _res: Response): ViewModel<CompanyFilingIdData> {
        const confirmCompanyLink : string = `${servicePathPrefix}${COMPANY_SEARCH}/`;
        const routeViews = "router_views/company/search";
        // Check if session has the company name or number already
        const sessionCompanyNumber = req.session?.data.signin_info?.company_number;
        logger.info(`Get request for serving company filing name/number entry page`);
        return { templatePath: `${routeViews}/search`, viewData: { ...this.baseViewData, companyId: sessionCompanyNumber, confirmCompanyLink: confirmCompanyLink }}
    }
}

interface CompanyFilingIdData extends BaseViewData {
    companyId?: string,
    confirmCompanyLink: string
}