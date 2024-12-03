import { env } from "../config";
import { HelmetOptions } from "helmet";

export function prepareCSPConfig(nonce: string): HelmetOptions{
    const CDN = env.CDN_HOST;
    const SELF = `'self'`;
    const NONCE = `'nonce-${nonce}'`;
    const PIWIK_URL = env.PIWIK_URL;
    const ONE_YEAR_SECONDS = 31536000;

    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN],
                imgSrc: [CDN],
                styleSrc: [NONCE, CDN],
                connectSrc: [SELF, CDN, PIWIK_URL],
                scriptSrc: [NONCE, CDN, PIWIK_URL],
                objectSrc: [`'none'`]
            }
        },
        referrerPolicy: {
            policy: ["same-origin"]
        },
        hsts: {
            maxAge: ONE_YEAR_SECONDS,
            includeSubDomains: true
        }
    };
}
