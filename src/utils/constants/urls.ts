export const servicePathPrefix = `/accounts-filing`;

export enum URL_QUERY_PARAM {
    PARAM_COMPANY_NUMBER = "companyNumber",
    PARAM_TRANSACTION_ID = "transactionId",
    PARAM_SUBMISSION_ID = "submissionId",
}

// Object containing the pages Urls within the service
export const Urls = {
    HOME: "/",
    HOME_WITH_COMPANY_NUMBER: "/company/:companyNumber",
    HEALTHCHECK: "/healthcheck",
    CONFIRMATION: "/confirmation-submission",
    COMPANY_SEARCH: '/company-search',
    CONFIRM_COMPANY: '/confirm-company',
    CONFIRM_COMPANY_CONTINUE_TO_ACCOUNTS_CHOOSER: '/confirm-company/continue',
    UPLOAD: "/upload",
    UPLOADED: "/uploaded",
    CHECK_YOUR_ANSWERS: "/check-your-answers",
    PAYMENT: "/payment",
    BEFORE_YOU_FILE_PACKAGE_ACCOUNTS: "/before-you-file-package-accounts",
    BEFORE_YOU_FILE_PACKAGE_ACCOUNTS_WITH_COMPANY_NUMBER: "/company/:companyNumber/before-you-file-package-accounts",
    CHOOSE_YOUR_ACCOUNTS_PACKAGE: "/choose-your-accounts-package",
    PAYMENT_CALLBACK: "/payment-callback"
} as const;


// Create prefixed urls by adding the service path prefix to each of the fields in the Urls object.
export const PrefixedUrls = Object.fromEntries(
    Object.entries(Urls).map(([key, value]) => [key, servicePathPrefix + value])
) as Readonly<{ [K in keyof typeof Urls]: string }>;

export const fileIdPlaceholder = '{fileId}';
export const COMPANY_LOOKUP = `/company-lookup/search?forward=${PrefixedUrls.CONFIRM_COMPANY}?companyNumber=%7BcompanyNumber%7D`;
export const SIGN_OUT = '/signout';
