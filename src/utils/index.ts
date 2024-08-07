import { Handler, Request } from "express";
import { servicePathPrefix } from "./constants/urls";

type Predicate<T> = (x: T) => boolean;

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export function skipIf(predicate: Predicate<Request>, handler: Handler): Handler {
    return (req, res, next) => {
        if (!predicate(req)) {
            handler(req, res, next);
        } else {
            next();
        }
    };
}

export function getRelativeUrl(req: Request): string {
    return (req.baseUrl + req.path).slice(servicePathPrefix.length);
}
