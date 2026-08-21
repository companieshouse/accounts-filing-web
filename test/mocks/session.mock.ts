import { Session } from "@companieshouse/node-session-handler";
import { SessionKey } from "@companieshouse/node-session-handler/lib/session/keys/SessionKey";
import { SignInInfoKeys } from "@companieshouse/node-session-handler/lib/session/keys/SignInInfoKeys";
import { IAccessToken, ISignInInfo, IUserProfile } from "@companieshouse/node-session-handler/lib/session/model/SessionInterfaces";

export const testSignedIn = 1;
export const testUserProfile: IUserProfile = { id: 'someId' };
export const testAccessToken: IAccessToken = { access_token: 'accessToken' };
export const TEST_EMAIL = "test_email@example.com";

export function getLoggedInSession(): Session {
    return new Session({
        [SessionKey.SignInInfo]: {
            [SignInInfoKeys.SignedIn]: testSignedIn,
            [SignInInfoKeys.UserProfile]: testUserProfile,
            [SignInInfoKeys.AccessToken]: testAccessToken
        } as ISignInInfo
    });
}

export function getLoggedInSessionWithEmail(): Session {
    const session = getLoggedInSession();
    session.data.signin_info!.user_profile!.email = TEST_EMAIL;
    return session;
}


export const getEmptySession = (): Session => {
    return new Session();
};
