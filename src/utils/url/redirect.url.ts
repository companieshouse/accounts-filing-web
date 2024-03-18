import { Request } from 'express';

export class RedirectUrl {

    private static redirectUrl(base: string, callback: string, redirect: string): string {
        return `${base}?callback=${callback}&backUrl=${redirect}`;
    }

    static getRedirectUrl(base: string, callback: string, redirect: string): string {
        return RedirectUrl.redirectUrl(base, callback, redirect);
    }

    /**
     *
     * @param req express Request
     * @returns the scheme and domain in the format of [scheme]://[domain]
     */
    static getUriBase(req: Request): string {
        return `${req.protocol}://${req.get('host')}`;
    }
}
