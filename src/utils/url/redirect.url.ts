import { Request } from 'express';

function redirectUrl(base: string, callback: string, redirect: string): string {
    return `${base}?callback=${callback}&backUrl=${redirect}`;
}

function getRedirectUrl(base: string, callback: string, redirect: string): string {
    return redirectUrl(base, callback, redirect);
}

/**
 *
 * @param req express Request
 * @returns the scheme and domain in the format of [scheme]://[domain]
 */
function getUriBase(req: Request): string {
    return `${req.protocol}://${req.get('host')}`;
}


export { getRedirectUrl, getUriBase };
