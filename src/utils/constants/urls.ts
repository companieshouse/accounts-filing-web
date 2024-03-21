export const servicePathPrefix = `/accounts-filing`;

export enum URL_QUERY_PARAM {
    PARAM_COMPANY_NUMBER = "companyNumber",
    PARAM_TRANSACTION_ID = "transactionId",
    PARAM_SUBMISSION_ID = "submissionId",
}

export const COMPANY_AUTH_PROTECTED_BASE = `/company/:${URL_QUERY_PARAM.PARAM_COMPANY_NUMBER}`;

// Object containing the pages Urls within the service
export const Urls = {
    HOME: "/",
    HEALTHCHECK: "/healthcheck",
    CONFIRMATION: "/confirmation-submission",
    COMPANY_SEARCH: '/company-search',
    CONFIRM_COMPANY: '/confirm-company',
    // Post companyNumber being set
    UPLOAD: `${COMPANY_AUTH_PROTECTED_BASE}/upload`,
    UPLOADED: `${COMPANY_AUTH_PROTECTED_BASE}/uploaded`,
    CHECK_YOUR_ANSWERS: `${COMPANY_AUTH_PROTECTED_BASE}/check-your-answers`,
} as const;


// Create prefixed urls by adding the service path prefix to each of the fields in the Urls object.
export const PrefixedUrls = Object.fromEntries(
    Object.entries(Urls).map(([key, value]) => [key, servicePathPrefix + value])
) as Readonly<{ [K in keyof typeof Urls]: string }>;

export const fileIdPlaceholder = '{fileId}';
export const COMPANY_LOOKUP = `/company-lookup/search?forward=${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=%7BcompanyNumber%7D`;
export const SIGN_OUT = '/signout';
