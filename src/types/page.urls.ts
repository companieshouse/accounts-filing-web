import { Templates } from "./template.paths";

export enum URL_QUERY_PARAM {
    PARAM_COMPANY_NUMBER = "companyNumber",
    PARAM_TRANSACTION_ID = "transactionId",
    PARAM_SUBMISSION_ID = "submissionId",
}

export const ACCOUNTS_FILING = "/accounts-filing-web";

export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${URL_QUERY_PARAM.PARAM_COMPANY_NUMBER}`;

export const CONFIRM_COMPANY = '/' + Templates.CONFIRM_COMPANY;
export const CONFIRM_COMPANY_PATH = ACCOUNTS_FILING + CONFIRM_COMPANY;