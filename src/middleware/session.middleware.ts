import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import { env } from "../config";

export const COOKIE_CONFIG = {
    cookieDomain: env.COOKIE_DOMAIN,
    cookieName: env.COOKIE_NAME,
    cookieSecret: env.COOKIE_SECRET,
    cookieSecureFlag: env.COOKIE_SECURE_FLAG
};


export const sessionMiddleware = (sessionStore: SessionStore) => SessionMiddleware(COOKIE_CONFIG, sessionStore, true);
