jest.mock("../../src/middleware/company.authentication.middleware");

import { NextFunction, Request, Response } from "express";
import { companyAuthenticationMiddleware } from "../../src/middleware/company.authentication.middleware";

// get handle on mocked function
const mockCompanyAuthenticationMiddleware = companyAuthenticationMiddleware as jest.Mock;

// tell the mock what to return
mockCompanyAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockCompanyAuthenticationMiddleware;
