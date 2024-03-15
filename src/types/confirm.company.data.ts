import { RegisteredOfficeAddress } from "@companieshouse/api-sdk-node/dist/services/company-profile/types";

export interface AccountsFilingCompanyProfile {
        companyName: string;
        companyNumber: string;
        companyStatus: string;
        companyStatusDetail: string;
        dateOfCreation: string;
        type: string;
        address: RegisteredOfficeAddress;
        nextDue: string;
        madeUpTo: string;
    }

export {};
