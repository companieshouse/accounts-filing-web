import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import { env } from "../config";
import Redis from "ioredis";

const CACHE_SERVER = env.CACHE_SERVER;
const COOKIE_DOMAIN = env.COOKIE_DOMAIN;
const COOKIE_NAME = env.COOKIE_NAME;
const COOKIE_SECRET = env.COOKIE_SECRET;

const redis = new Redis(`redis://${CACHE_SERVER}`);
const sessionStore = new SessionStore(redis);

export const sessionMiddleware = SessionMiddleware({
    cookieDomain: COOKIE_DOMAIN,
    cookieName: COOKIE_NAME,
    cookieSecret: COOKIE_SECRET,
    cookieSecureFlag: undefined,
    cookieTimeToLiveInSeconds: undefined,
}, sessionStore);
