import { Request } from "express";
import { logger } from "../../../utils/logger";
import { URL_QUERY_PARAM } from "../../../utils/constants/urls";


export class CompanyAuthenticationHelper {

    static getCompanyNumberFromRequest(req: Request): string {
        const companyNumber = req.params[URL_QUERY_PARAM.PARAM_COMPANY_NUMBER];
        logger.debug(`Using param value for companyNumber: ${companyNumber}`);
        return companyNumber;
    }

}
