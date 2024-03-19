import { Resource } from "@companieshouse/api-sdk-node";
import ApiClient from "@companieshouse/api-sdk-node/dist/client";
import { CompanyProfile } from "@companieshouse/api-sdk-node/dist/services/company-profile";
import { logger } from "../../utils/logger";


export class CompanyProfileService {
    constructor(private apiClient: ApiClient) {}

    async getCompanyProfile(requestedCompanyNumber: string): Promise<CompanyProfile> {

        const companyProfile: Resource<CompanyProfile> = await this.apiClient.companyProfile.getCompanyProfile(requestedCompanyNumber);
        if (companyProfile.httpStatusCode !== 200) {
            logger.error(`Company Profile has return http status of ${companyProfile.httpStatusCode}`);
            throw new Error("Unable to process requested company number");
        }

        if (!companyProfile.resource) {
            logger.error(`Company profile return without a resource`);
            throw new Error("Unable to process requested company number");
        }

        return companyProfile.resource;
    }

}
