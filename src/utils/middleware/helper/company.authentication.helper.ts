import { Request } from "express";
import { must } from "../../../utils/session";
import { logger } from "../../../utils/logger";
import { URL_QUERY_PARAM } from "../../../utils/constants/urls";


export class CompanyAuthenticationHelper {

    static getCompanyNumberFromRequest(req: Request): string {
        let companyNumber;

        // Will use param value over session value
        if (req.params?.["companyNumber"]){
            logger.debug("Using param value for companyNumber");
            companyNumber = req.params[URL_QUERY_PARAM.PARAM_COMPANY_NUMBER];
        } else {
            logger.debug("Using session value for companyNumber");
            companyNumber = must(req.session?.data.signin_info?.company_number);
        }

        return companyNumber;
    }

}
