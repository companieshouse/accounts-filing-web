export const servicePathPrefix = `/accounts-filing`;

export enum URL_QUERY_PARAM {
    PARAM_COMPANY_NUMBER = "companyNumber",
    PARAM_TRANSACTION_ID = "transactionId",
    PARAM_SUBMISSION_ID = "submissionId",
}

export const CONFIRM_COMPANY = '/confirm-company';
export const CONFIRM_COMPANY_PATH = servicePathPrefix + CONFIRM_COMPANY;
export const healthcheckUrl = '/healthcheck';
export const fileIdPlaceholder = '{fileId}';
export const uploadedUrl = '/uploaded';
export const COMPANY_SEARCH = '/company-search';
export const SIGN_OUT = '/signout';

export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${URL_QUERY_PARAM.PARAM_COMPANY_NUMBER}`;

export const COMPANY_AUTH_UPLOAD = `${COMPANY_AUTH_PROTECTED_BASE}${uploadedUrl}`;

export const COMPANY_LOOKUP = `/company-lookup/search?forward=${servicePathPrefix}${CONFIRM_COMPANY}?companyNumber=%7BcompanyNumber%7D`;
