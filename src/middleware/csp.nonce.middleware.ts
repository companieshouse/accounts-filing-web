import { NextFunction, Request, Response } from "express";

// assign cspNonce value to the response requests to be used in views
export function assignCspNonce(nonce: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        res.locals.cspNonce = nonce;
        next();
    };
}
