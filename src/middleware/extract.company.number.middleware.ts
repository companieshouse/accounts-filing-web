import { Request, Response, NextFunction } from "express";
import { checkCompanyNumberFormatIsValidate } from "../utils/format/company.number.format";
import { ContextKeys } from "../utils/constants/context.keys";
import { getCompanyNumber } from "../utils/session";
import { logger } from "../utils/logger";

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

            if (isSessionSet) {
                req.session!.setExtraData(ContextKeys.COMPANY_NUMBER, companyNumber);
                logger.info(`Company Number set in session: ${companyNumber}`);
            }
        } else if (isSessionSet) {
            const result = getCompanyNumber(req.session);
            companyNumber = result instanceof Error ? "" : result;
            logger.info(`Company Number from session: ${companyNumber}`);
        }

        req.companyNumber = companyNumber;
    } catch (error) {
        logger.error(`Company Number is invalid: ${error}`);
        req.companyNumber = "";
    }

    next();
};
