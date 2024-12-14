import { Request, Response, NextFunction } from "express";
import { ContextKeys } from "../utils/constants/context.keys";
import { getCompanyNumber } from "../utils/session";
import { logger } from "../utils/logger";
import { ValidateCompanyNumberFormat } from "../utils/validate/validate.company.number";

declare module 'express-serve-static-core' {
    interface Request {
        companyNumber?: string;
    }
}

export const extractCompanyNumberMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const isSessionSet = typeof req.session !== "undefined";
    const companyNumberParam = req.params.companyNumber;
    let companyNumber: string = "";


    if (companyNumberParam) {

        try {
            if (ValidateCompanyNumberFormat.isValid(companyNumberParam)){
                companyNumber = companyNumberParam;
            }
        } catch (e){
            logger.error(`Company Number: ${companyNumberParam} is not a valid company number`);
        }

        if (isSessionSet && companyNumber !== "") {
                req.session!.setExtraData(ContextKeys.COMPANY_NUMBER, companyNumber);
                logger.info(`Company Number set in session: ${companyNumber}`);
        }
    } else if (isSessionSet) {
        const result = getCompanyNumber(req.session);
        if ( !(result instanceof Error) && result !== ""){
            companyNumber = result;
        }
        logger.info(`Company Number from session: ${companyNumber}`);
    }

    req.companyNumber = companyNumber;

    next();
};
