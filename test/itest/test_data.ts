import { RegexString } from "./test_types";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { Transaction } from "@companieshouse/api-sdk-node/dist/services/transaction/types";

export const ExternalUrlGeneralRegex: Record<string, RegexString> = {
    COMPANY_LOOKUP: '/company-lookup/search.*' as RegexString,
    XBRL_VALIDATE: '.*/xbrl_validate/submit.*' as RegexString
};

export const TEST_COMPANY_NUMBER = "01234567";
export const TEST_COMPANY_NAME = "MOCK_COMPANY_NAME";

export function getTemplateCompanyProfile(company_type: string = "uksef"): CompanyProfile {
    return {
        registeredOfficeAddress: {
            addressLineOne: "Addr ln 1",
            addressLineTwo: "Addr ln 2",
            postalCode: "POSTCODE",
        },
        companyName: TEST_COMPANY_NAME,
        companyNumber: TEST_COMPANY_NUMBER,
        companyStatus: "mock_status",
        dateOfCreation: "2026-01-01",
        type: company_type,
        accounts: {
            nextAccounts: {
                periodStartOn: "2026-01-02"
            },
            nextDue: "2026-01-03"
        }
    } as CompanyProfile;
}

export const MOCK_ACCOUNT_FILING_ID = "fake_file_id";

export const MOCK_TRANSACTION_ID = 12345;
export const MOCK_TRANSACTION = { id: MOCK_TRANSACTION_ID } as unknown as Transaction;
