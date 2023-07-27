import { SessionMiddleware, SessionStore } from "@companieshouse/node-session-handler";
import Redis from "ioredis";

const CACHE_SERVER = process.env.CACHE_SERVER ?? '';
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN ?? '';
const COOKIE_NAME = process.env.COOKIE_NAME ?? '';
const COOKIE_SECRET = process.env.COOKIE_SECRET ?? '';

const redis = new Redis(CACHE_SERVER);
const sessionStore = new SessionStore(redis);

export const sessionMiddleware = SessionMiddleware({
  cookieDomain: COOKIE_DOMAIN,
  cookieName: COOKIE_NAME,
  cookieSecret: COOKIE_SECRET,
  cookieSecureFlag: undefined,
  cookieTimeToLiveInSeconds: undefined,
}, sessionStore, true);