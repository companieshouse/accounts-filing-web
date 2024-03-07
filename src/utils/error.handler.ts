import { Handler, NextFunction, Request, Response } from "express";


/**
 * The `handleExceptions` function is an Express.js handler wrapper that ensures exceptions within handlers are caught and passed to error handling middleware.
 * Without it, uncaught exceptions would crash the service. It takes a handler function as an argument, returns a new function that wraps the original in a try/catch block.
 * If an exception is thrown, it's caught and passed to the next middleware. This can't be implemented as a regular middleware due to Express.js's setup, hence the need for a wrapper function.
 *
 * @param {function} fn - The handler function to be wrapped.
 * @return {function} A new handler that wraps the original in a try/catch block.
 */
export function handleExceptions(fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): Handler {
    return async (req, res, next) => {
        try {
            await fn(req, res, next);
        } catch (e) {
            // Pass the error to the next middleware
            next(e);
        }
    };
}
