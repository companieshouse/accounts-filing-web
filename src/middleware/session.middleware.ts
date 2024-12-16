import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import { env } from "../config";

const COOKIE_DOMAIN = env.COOKIE_DOMAIN;
const COOKIE_NAME = env.COOKIE_NAME;
const COOKIE_SECRET = env.COOKIE_SECRET;


export const COOKIE_CONFIG = {
    cookieDomain: COOKIE_DOMAIN,
    cookieName: COOKIE_NAME,
    cookieSecret: COOKIE_SECRET,
    cookieSecureFlag: undefined,
    cookieTimeToLiveInSeconds: undefined
};


export const sessionMiddleware = (sessionStore: SessionStore) => SessionMiddleware(COOKIE_CONFIG, sessionStore);
