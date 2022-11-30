import { msalInstance } from "MSAL/instance";
import { IPublicClientApplication } from "@azure/msal-browser";
import { FetchError } from "@nait-aits/usestateloader";

const scopes = [`${process.env.REACT_APP_AZUREAD_SCOPE}`];

export function performLogin(
  instance: IPublicClientApplication,
  loginCallback?: () => void
) {
  instance
    .loginRedirect({
      scopes: scopes,
    })
    .then((e) => {
      loginCallback && loginCallback();
    })
    .catch((e) => {
      console.log(e);
    });
}

const getAuthBearerToken = (msalInstance: IPublicClientApplication) => {
  var userAccount = msalInstance.getAllAccounts()[0];

  var authValue = msalInstance
    .acquireTokenSilent({
      scopes: scopes,
      account: userAccount,
    })
    .then((msalResopnse) => {
      return { token: msalResopnse.accessToken };
    })
    .catch(
      (reason: {
        errorCode: string;
        errorMessage: string;
        subError: string;
        name: string;
      }) => {
        return new FetchError(
          reason.errorMessage,
          reason.errorCode,
          reason.name
        );
      }
    );

  return authValue;
};

export async function getToken() {
  var ret = await getAuthBearerToken(msalInstance);

  //if token is no longer valid, force relogin
  if (ret instanceof FetchError) {
    if (ret.errorCode === "invalid_grant") {
      performLogin(msalInstance);
    }

    return ret;
  } else {
    return ret;
  }
}

export default getToken;
