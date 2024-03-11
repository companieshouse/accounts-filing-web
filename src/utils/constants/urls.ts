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
    SUBMIT: "/submit",
    UPLOADED: "/uploaded",
    CHECK_YOUR_ANSWERS: "/check-your-answers",
    CONFIRMATION: "/confirmation-submission"
} as const;

// Create prefixed urls by adding the service path prefix to each of the fields in the Urls object.
export const PrefixedUrls = Object.fromEntries(
    Object.entries(Urls).map(([key, value]) => [key, servicePathPrefix + value])
) as Readonly<{ [K in keyof typeof Urls]: string }>;

export const CONFIRM_COMPANY = '/confirm-company';
export const CONFIRM_COMPANY_PATH = servicePathPrefix + CONFIRM_COMPANY;
export const healthcheckUrl = Urls.HEALTHCHECK;
export const submitUrl = Urls.SUBMIT;
export const fileIdPlaceholder = '{fileId}';
export const uploadedUrl = Urls.UPLOADED;
