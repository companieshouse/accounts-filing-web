import { Resource } from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { AccountsFilingCompanyProfile } from "../../types/confirm.company.data";
import { logger } from "../../utils/logger";
import { FormatDate } from "../../utils/format/format.date";


export class CompanyProfileService {
    constructor(private apiClient: ApiClient) {}

    async getCompanyProfile(requestedCompanyNumber: string): Promise<AccountsFilingCompanyProfile> {

        const companyProfile: Resource<CompanyProfile> = await this.apiClient.companyProfile.getCompanyProfile(requestedCompanyNumber);
        if (companyProfile.httpStatusCode !== 200) {
            logger.error(`Company Profile has return http status of ${companyProfile.httpStatusCode}`);
            throw new Error("Unable to process requested company number");
        }

        if (!companyProfile.resource) {
            logger.error(`Company profile return without a resource`);
            throw new Error("Unable to process requested company number");
        }

        return this.mapToAccountsFilingCompanyProfile(companyProfile.resource);
    }

    private mapToAccountsFilingCompanyProfile(companyProfile: CompanyProfile): AccountsFilingCompanyProfile {
        return {
            companyName: companyProfile.companyName,
            companyNumber: companyProfile.companyNumber,
            companyStatus: companyProfile.companyStatus,
            dateOfCreation: FormatDate.formatToUKString(companyProfile.dateOfCreation),
            type: this.formatType(companyProfile.type),
            address: companyProfile.registeredOfficeAddress,
            nextDue: FormatDate.formatToUKString(companyProfile.accounts.nextDue),
            madeUpTo: FormatDate.formatToUKString(companyProfile.accounts.nextAccounts.periodStartOn)
        } as AccountsFilingCompanyProfile;
    }

    private formatType(type: string): string {
        return type.split("-").join(" ");
    }
}
