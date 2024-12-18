import { env } from "../config";
import { HelmetOptions } from "helmet";

export function prepareCSPConfig(nonce: string): HelmetOptions{
    const removeProtocol = (url: string) => url.replace(/(^\w+:|^)\/\//, '');
    const CDN = removeProtocol(env.CDN_HOST);
    const SELF = `'self'`;
    const NONCE = `'nonce-${nonce}'`;
    const PIWIK_URL = env.PIWIK_URL;
    const PIWIK_CHS_DOMAIN = process.env.PIWIK_CHS_DOMAIN as string;
    const ONE_YEAR_SECONDS = 31536000;

    return {
        contentSecurityPolicy: {
            directives: {
                upgradeInsecureRequests: null,
                defaultSrc: [SELF],
                fontSrc: [CDN],
                imgSrc: [SELF, CDN, PIWIK_URL],
                styleSrc: [NONCE, CDN],
                connectSrc: [SELF, CDN, PIWIK_URL],
                formAction: [SELF, PIWIK_CHS_DOMAIN],
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
