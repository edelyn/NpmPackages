import { FetchError, useGetToken } from "@nait-aits/azure-ad-auth";
import { useState } from "react";
import styled from "styled-components";
import PageWrapper from "../../components/PageWrapper";

export type Props = {};

function UseGetToken(props: Props) {
  const [token, setToken] = useState("");

  var tokenGetter = useGetToken();

  return (
    <PageWrapper title={"useGetToken"}>
      {token && <div>Token: {token}</div>}
      <button
        onClick={() => {
          tokenGetter().then((token) => {
            setToken("Loading Token...");

            if (token instanceof FetchError) {
              setToken("Error: " + token.message);
            } else {
              setToken(token.token);
            }
          });
        }}
      >
        Get Token
      </button>
    </PageWrapper>
  );
}

const Wrapper = styled.div``;
export default UseGetToken;
