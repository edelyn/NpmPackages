import { useMsal } from "@azure/msal-react";
import { useContext } from "react";

import { AzureADScopeContext } from "../providers/AzureADAuthenticationProvider";
import { FetchError } from "../types/Types";

export function useGetToken() {
  var scopeContext = useContext(AzureADScopeContext);
  var { instance } = useMsal();

  var caller = () => {
    var scopes: string[] = scopeContext ?? [];

    var userAccount = instance.getAllAccounts()[0];

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
