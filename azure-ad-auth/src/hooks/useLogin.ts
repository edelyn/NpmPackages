import {
  EndSessionPopupRequest,
  EndSessionRequest,
  PopupRequest,
  RedirectRequest,
} from "@azure/msal-browser";
import { useMsal } from "@azure/msal-react";
import { useContext } from "react";

import { AzureADScopeContext } from "../providers/NaitAzureADAuthProvider";

export function useLogin() {
  var scopeContext = useContext(AzureADScopeContext);

  var { instance } = useMsal();

  return {
    loginPopup: (request?: PopupRequest) => {
      var scopes = request?.scopes ?? scopeContext ?? [];
      return instance.loginPopup({
        ...(request || {}),
        scopes,
      });
    },
    loginRedirect: (request?: RedirectRequest) => {
      var scopes = request?.scopes ?? scopeContext ?? [];
      
      return instance.loginRedirect({
        ...(request || {}),
        scopes,
      });
    },
    logoutPopup: (logoutRequest?: EndSessionPopupRequest) => {
      return instance.logoutPopup(logoutRequest);
    },
    logoutRedirect: (logoutRequest?: EndSessionRequest) => {
      return instance.logoutRedirect(logoutRequest);
    },
  };
}

export default useLogin;
