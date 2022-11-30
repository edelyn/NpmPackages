import { PublicClientApplication } from "@azure/msal-browser";
import { loadMsalConfig } from "./authConfig";

export const msalInstance = new PublicClientApplication(
  loadMsalConfig({
    clientId: process.env.REACT_APP_AZUREAD_CLIENTID || "",
    tenantId: process.env.REACT_APP_AZUREAD_AUTHORITY || "",
    redirectUri: window.location.origin,
  })
);
