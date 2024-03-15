import ApiClient from '@companieshouse/api-sdk-node/dist/client';
import { CompanyProfileService } from '../../src/services/external/company.profile.service';

jest.mock("../../src/services/external/company.profile.service");

export const companyProfileServiceMock = new CompanyProfileService({} as ApiClient) as jest.Mocked<CompanyProfileService>;
