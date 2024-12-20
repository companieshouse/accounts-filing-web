export const mockGetCompanyProfile = jest.fn();
jest.mock('../../src/services/external/company.profile.service', () => {
    return {
        CompanyProfileService: jest.fn().mockImplementation(() => {
            return {
                getCompanyProfile: mockGetCompanyProfile
            };
        }),

        getCompanyProfile: jest.fn()
    };
});
jest.mock("../../src/services/external/company.profile.service");

import { CompanyProfileService, getCompanyProfile } from '../../src/services/external/company.profile.service';
import ApiClient from '@companieshouse/api-sdk-node/dist/client';

export const companyProfileServiceMock = new CompanyProfileService({} as ApiClient) as jest.Mocked<CompanyProfileService>;
export const mockGetCompanyProfileFn = getCompanyProfile as jest.Mock;
