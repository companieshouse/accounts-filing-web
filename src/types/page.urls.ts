export enum urlParams {
    PARAM_ZIP_NUMBER = "zipNumber",
    PARAM_COMPANY_NUMBER = "companyNumber",
    PARAM_TRANSACTION_ID = "transactionId",
    PARAM_SUBMISSION_ID = "submissionId",
}

export enum URL_QUERY_PARAM {
    COMPANY_NUM = "companyNumber",
    PARAM_TRANSACTION_ID = "transactionId",
    PARAM_SUBMISSION_ID = "submissionId",
}

export const ACCOUNTS_FILING = "/accounts-filing-web";

export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${urlParams.PARAM_COMPANY_NUMBER}`;