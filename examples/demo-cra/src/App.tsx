import { NaitFetchStateProvider } from "@nait-aits/fetch-state";
import { NaitAzureADAuthProvider, useGetToken } from "@nait-aits/azure-ad-auth";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import UseGetToken from "./pages/AzureADAuth/UseGetToken";
import { useState } from "react";
import UseStateLoader from "./pages/FetchState/UseStateLoader";
import UseLoadState from "./pages/FetchState/UseLoadState";
import UseFetcher from "./pages/FetchState/UseFetcher";

function App() {
  const [showAdDebug, setShowAdDebug] = useState(false);
  const [showFetchDebug, setShowFetchDebug] = useState(false);

  return (
    <NaitAzureADAuthProvider
      config={{
        debug: showAdDebug,
      }}
    >
      <NaitFetchStateProvider
        config={{
          baseUrl: process.env.REACT_APP_API_BASE_URL || "",
          getAuthToken: useGetToken,
          debug: showFetchDebug,
        }}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/AzureADAuth/UseGetToken" element={<UseGetToken />} />
            <Route
              path="/FetchState/UseStateLoader"
              element={<UseStateLoader />}
            />
            <Route path="/FetchState/UseLoadState" element={<UseLoadState />} />
            <Route path="/FetchState/UseFetcher" element={<UseFetcher />} />
          </Routes>
        </BrowserRouter>
        <div style={{ marginTop: -40 }}>
          <button
            onClick={() => {
              setShowAdDebug(!showAdDebug);
            }}
          >
            Toggle AD Debug
          </button>
          <button
            onClick={() => {
              setShowFetchDebug(!showFetchDebug);
            }}
          >
            Toggle fetcher Debug
          </button>
        </div>
      </NaitFetchStateProvider>
    </NaitAzureADAuthProvider>
  );
}

export default App;
