/*
  Source: overseas-entities-web
  Mock Implementation of Web Node Security CsrfProtectionMiddleware.
  Note: this needs to be imported before the 'app' component in each test module in order for 'app' to be able to mock it.
*/

import { NextFunction, Request, Response } from "express";
import * as webSecurity from "@companieshouse/web-security-node";
jest.spyOn(webSecurity, "CsrfProtectionMiddleware");
// get handle on mocked function
const mockCsrfProtectionMiddleware = webSecurity.CsrfProtectionMiddleware as jest.Mock;

// get handle on mocked function
mockCsrfProtectionMiddleware.mockImplementation((_opts) => (req: Request, res: Response, next: NextFunction) => next());

export default mockCsrfProtectionMiddleware;
