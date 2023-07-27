jest.mock("../../src/middleware/authentication.middleware");

import { NextFunction, Request, Response } from "express";
import { authenticationMiddleware } from "../../src/middleware/authentication.middleware";

// get handle on mocked function
const mockAuthenticationMiddleware = authenticationMiddleware as jest.Mock;

// tell the mock what to return
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

export default mockAuthenticationMiddleware;
