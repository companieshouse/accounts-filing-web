import { Request } from 'express';
import { env } from "../config";
import { getCompanyNumber, must } from './session';
import { PrefixedUrls, URL_QUERY_PARAM, fileIdPlaceholder } from './constants/urls';

function redirectUrl(base: string, callback: string, redirect: string): string {
    return `${base}?callback=${callback}&backUrl=${redirect}`;
}

function getRedirectUrl(callback: string, redirect: string): string {
    return redirectUrl(env.SUBMIT_VALIDATION_URL, callback, redirect);
}

/**
 *
 * @param req express Request
 * @returns the scheme and domain in the format of [scheme]://[domain]
 */
function getUriHost(req: Request): string {
    return `${req.protocol}://${req.get('host')}`;
}


function constructValidatorRedirect(req: Request): string{
    const base = getUriHost(req);
    const companyNumber = must(getCompanyNumber(req.session));
    const zipPortalCallbackUrl = encodeURIComponent(`${base}${PrefixedUrls.UPLOADED}/${fileIdPlaceholder}`);
    const xbrlValidatorBackUrl = encodeURIComponent(`${base}${PrefixedUrls.CONFIRM_COMPANY}?${URL_QUERY_PARAM.PARAM_COMPANY_NUMBER}=${companyNumber}`);
    return getRedirectUrl(zipPortalCallbackUrl, xbrlValidatorBackUrl);
}

export { constructValidatorRedirect };
