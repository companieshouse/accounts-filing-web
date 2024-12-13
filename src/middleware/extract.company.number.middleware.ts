import { Request, Response, NextFunction } from "express";
import { checkCompanyNumberFormatIsValidate } from "../utils/format/company.number.format";
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
    try {
        const isSessionSet = typeof req.session !== "undefined";
        const companyNumberParam = req.params.companyNumber;
        let companyNumber: string = "";

        if (companyNumberParam) {
            checkCompanyNumberFormatIsValidate(companyNumberParam);
            companyNumber = companyNumberParam;

            if (isSessionSet && ValidateCompanyNumberFormat.isValid(companyNumber)) {
                req.session!.setExtraData(ContextKeys.COMPANY_NUMBER, companyNumber);
                logger.info(`Company Number set in session: ${companyNumber}`);
            }
        } else if (isSessionSet) {
            let result = getCompanyNumber(req.session);
            result = result instanceof Error ? "" : result;
            companyNumber = result === "" ? companyNumber : result;
            logger.info(`Company Number from session: ${companyNumber}`);
        }

        req.companyNumber = companyNumber;
    } catch (error) {
        logger.error(`Company Number is invalid: ${error}`);
        req.companyNumber = "";
    }

    next();
};
