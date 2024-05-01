import { Request } from 'express';
import { env } from "../config";
import { getCompanyNumber, getPackageType, must } from './session';
import { PrefixedUrls, URL_QUERY_PARAM, fileIdPlaceholder } from './constants/urls';
import { PackageType } from '@companieshouse/api-sdk-node/dist/services/accounts-filing/types';

function constructRedirectUrl(base: string, queries: {[key: string]: string|PackageType}): string {
    const queryParams = Object.entries(queries).flatMap((value, _index) => {return `${value[0]}=${value[1]}`;}).join("&");
    return `${base}?${queryParams}`;
}

function getRedirectUrl(callback: string, redirect: string, packageType: PackageType): string {
    return constructRedirectUrl(env.SUBMIT_VALIDATION_URL, { callback, backUrl: redirect, packageType });

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
    const packageType = must(getPackageType(req.session));
    return getRedirectUrl(zipPortalCallbackUrl, xbrlValidatorBackUrl, packageType);
}

export { constructValidatorRedirect };

export const getPaymentResourceUri = (transactionId : string) : string => {
    return env.API_URL + `/transactions/${transactionId}/payment`
};

export const PAYMENT_REDIRECT_URI = `${env.CHS_URL}${PrefixedUrls.PAYMENT_CALLBACK}`;