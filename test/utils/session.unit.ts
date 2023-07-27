import { Session } from '@companieshouse/node-session-handler';
import { getSessionRequest, testAccessToken } from '../mocks/session.mock';
import { getSignInInfo, getAccessToken } from "../../src/utils/session";

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
});