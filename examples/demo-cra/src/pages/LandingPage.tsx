import PageWrapper from "../components/PageWrapper";

export type Props = {};

function LandingPage(props: Props) {
  return (
    <PageWrapper title="Select Page">
      <h1>azure-ad-auth</h1>
      <div>
        <ul>
          <li>
            <a href="/AzureADAuth/UseGetToken">useGetToken</a>
          </li>
        </ul>
      </div>
      <h1>fetch-state</h1>
      <div>
        <ul>
          <li>
            <a href="/FetchState/UseStateLoader">useStateLoader</a>
          </li>
          <li>
            <a href="/FetchState/UseLoadState">useLoadState</a>
          </li>
          <li>
            <a href="/FetchState/UseFetcher">useFetcher</a>
          </li>
        </ul>
      </div>
    </PageWrapper>
  );
}

export default LandingPage;
