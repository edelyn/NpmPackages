import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import styled from "styled-components";

export type Props = {
  children?: React.ReactNode | string;
  title: string;
  requireLogin?: boolean;
};

function PageWrapper(props: Props) {
  const { children, title, requireLogin } = props;

  const isAuthenticated = useIsAuthenticated();
  var { instance, accounts } = useMsal();

  return (
    <GridWrapper>
      <HeadingBar>
        <div style={{ flexGrow: 1, fontSize: 24 }}>{title}</div>
        {process.env.REACT_APP_MODE && <div>{process.env.REACT_APP_MODE}</div>}
        <div>
          <div>
            {accounts && accounts?.length > 0 && (
              <>Logged in as {accounts[0].name}</>
            )}
          </div>
          <div>
            <button
              onClick={() => {
                isAuthenticated && instance.logoutPopup();
                !isAuthenticated && instance.loginPopup();
              }}
            >
              Log {isAuthenticated ? "Out" : "In"}
            </button>
          </div>
        </div>
      </HeadingBar>
      <MenuBar>
        {window.location.pathname !== "/" && <a href="/">Home</a>}
      </MenuBar>
      <Content>
        {requireLogin && !isAuthenticated && <div>Please login</div>}
        {(!requireLogin || isAuthenticated) && <div>{children}</div>}
      </Content>
    </GridWrapper>
  );
}

const GridWrapper = styled.div`
  display: grid;
  grid-template-rows: auto auto 1fr;
  height: 100vh;
`;

const Content = styled.div`
  margin: 20px;
`;

const HeadingBar = styled.div<{ bgcolor?: string }>`
  padding: 20px;
  background-color: ${({ bgcolor = "rgb(72, 106, 255)" }) => bgcolor};
  color: white;
  font-weight: bold;
  display: flex;
`;

const MenuBar = styled.div<{ bgcolor?: string }>`
  padding: 20px;
  background-color: ${({ bgcolor = "rgb(192, 203, 255)" }) => bgcolor};
  color: white;
  display: flex;
`;

export default PageWrapper;
