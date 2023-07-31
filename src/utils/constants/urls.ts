export const servicePathPrefix = `/accounts-filing`;

export enum URL_QUERY_PARAM {
    PARAM_COMPANY_NUMBER = "companyNumber",
    PARAM_TRANSACTION_ID = "transactionId",
    PARAM_SUBMISSION_ID = "submissionId",
}

export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${URL_QUERY_PARAM.PARAM_COMPANY_NUMBER}`;

export const CONFIRM_COMPANY = '/confirm-company';
export const CONFIRM_COMPANY_PATH = servicePathPrefix + CONFIRM_COMPANY;
export const healthcheckUrl = '/healthcheck';
