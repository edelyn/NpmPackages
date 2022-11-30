import { useMsal } from "@azure/msal-react";
import { useContext } from "react";
import { FetchError } from "../components/fetcher";

import { AzureADScopeContext } from "../providers/AzureADAuthenticationProvider";

export function useGetToken() {
  var scopeContext = useContext(AzureADScopeContext);
  var { instance } = useMsal();
  var userAccount = instance.getAllAccounts()[0];

  var caller = () => {
    var scopes: string[] = scopeContext ?? [];

    var authValue = instance
      .acquireTokenSilent({
        scopes: scopes || [],
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

  return caller;
}

export default useGetToken;
