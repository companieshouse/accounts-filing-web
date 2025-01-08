import { Session } from '@companieshouse/node-session-handler';
import { getSessionRequest, testAccessToken } from '../mocks/session.mock';
import { getSignInInfo, getAccessToken, clearSession } from "../../src/utils/session";
import { ContextKeys } from '../../src/utils/constants/context.keys';

describe('SessionUtils test suite', () => {
    const testSessionRequest: Session = getSessionRequest();

    it('Test function getSignInInfo()', () => {
        const signInInfo = getSignInInfo(testSessionRequest);
        expect(signInInfo?.signed_in).toBeDefined();
    });

    it('Test function getAccessToken()', () => {
        const signInInfo = getAccessToken(testSessionRequest);
        expect(signInInfo).toEqual(testAccessToken.access_token);
    });

    describe('clearSession', () => {
        let mockSession: Session;

        beforeEach(() => {
            mockSession = {
                deleteExtraData: jest.fn(),
                getExtraData: jest.fn()
            } as unknown as Session;
        });

        it('should clear all specified session data', () => {
            clearSession(mockSession);

            expect(mockSession.deleteExtraData).toHaveBeenCalledWith(ContextKeys.TRANSACTION_ID);
            expect(mockSession.deleteExtraData).toHaveBeenCalledWith(ContextKeys.ACCOUNTS_FILING_ID);
            expect(mockSession.deleteExtraData).toHaveBeenCalledWith(ContextKeys.PACKAGE_TYPE);
            expect(mockSession.deleteExtraData).toHaveBeenCalledWith(ContextKeys.COMPANY_NAME);
            expect(mockSession.deleteExtraData).toHaveBeenCalledWith(ContextKeys.COMPANY_NUMBER);
            expect(mockSession.deleteExtraData).toHaveBeenCalledWith(ContextKeys.LANGUAGE);
            expect(mockSession.deleteExtraData).toHaveBeenCalledWith(ContextKeys.IS_CHS_JOURNEY);
        });

        it('should throw an error if session is undefined', () => {
            expect(() => clearSession(undefined)).toThrow('Unable to clear session as session is undefined');
        });
    });
});
