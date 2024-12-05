import { Request, Response, NextFunction } from "express";
import { checkCompanyNumberFormatIsValidate } from "../../src/utils/format/company.number.format";

export const extractCompanyNumberMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const companyNumber = req.params.companyNumber;

    if (companyNumber) {
        try {
            checkCompanyNumberFormatIsValidate(companyNumber);

            if (req.session) {
                req.session.setExtraData("companyNumber", companyNumber);
            }
        } catch (error) {
            return next(error);
        }
    }

    next();
};
