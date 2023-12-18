import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import { env } from "../config";
import Redis from "ioredis";
import { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger";

const CACHE_SERVER = env.CACHE_SERVER;
const COOKIE_DOMAIN = env.COOKIE_DOMAIN;
const COOKIE_NAME = env.COOKIE_NAME;
const COOKIE_SECRET = env.COOKIE_SECRET;

logger.debug(`Connecting to redis ${maskString(CACHE_SERVER)}`);

const redis = new Redis(`redis://${CACHE_SERVER}`);
const sessionStore = new SessionStore(redis);

function maskString(s: string, n = 5, mask = "*"): string {
    return [...s].map((char, index) => (index < n ? char : mask)).join("");
}

export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // TODO: Added to debug logs not appearing. Remove once session middleware issues resolved.
    const configDebugVars = {
        CACHE_SERVER: maskString(CACHE_SERVER),
        COOKIE_DOMAIN: maskString(COOKIE_DOMAIN),
        COOKIE_NAME: maskString(COOKIE_NAME),
        COOKIE_SECRET: maskString(COOKIE_SECRET)
    };

    logger.debug(`Session middleware running. Config: ${JSON.stringify(configDebugVars)}`);

    SessionMiddleware({
        cookieDomain: COOKIE_DOMAIN,
        cookieName: COOKIE_NAME,
        cookieSecret: COOKIE_SECRET,
        cookieSecureFlag: undefined,
        cookieTimeToLiveInSeconds: undefined,
    }, sessionStore, true)(req, res, next);

    logger.debug(`Session middleware complete`);
};


