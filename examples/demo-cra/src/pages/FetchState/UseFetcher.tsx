import { FetchError, StateItem, useFetcher } from "@nait-aits/fetch-state";
import { useEffect, useState } from "react";
import PageWrapper from "../../components/PageWrapper";

type Repo = { name: string; id: number; fullName: string; html_url: string };

function UseLoadState() {
  var [repos, setRepos] = useState<StateItem<Repo[] | undefined>>();

  var fetcher = useFetcher();

  useEffect(() => {
    fetcher.fetch<Repo[]>({
      url: "https://api.github.com/users/edelyn/repos",
      excludeBaseUrl: true,
      method: "GET",
      onChange(event, data) {
        if (event === "start") {
          setRepos({ loading: true });
        } else if (event === "end" && !(data instanceof FetchError)) {
          setRepos({ loading: false, data });
        } else if (event === "error" && data instanceof FetchError) {
          setRepos({ loading: false, error: data });
        }
      },
    });
  }, []);

  return (
    <PageWrapper title={"useLoadState"}>
      <div>
        <pre>
          <code>
            {`
  var [repos, setRepos] = useState<StateItem<Repo[] | undefined>>();

  var fetcher = useFetcher();

  useEffect(() => {
    fetcher.fetch<Repo[]>({
      url: "https://api.github.com/users/edelyn/repos",
      excludeBaseUrl: true,
      method: "GET",
      onChange(event, data) {
        if (event === "start") {
          setRepos({ loading: true });
        } else if (event === "end" && !(data instanceof FetchError)) {
          setRepos({ loading: false, data });
        } else if (event === "error" && data instanceof FetchError) {
          setRepos({ loading: false, error: data });
        }
      },
    });
  }, []);
        `}
          </code>
        </pre>
        <h1>Github Repos for edelyn</h1>
        {repos?.loading && <div>Loading...</div>}
        {repos?.error && <div>Error: {repos.error?.message}</div>}
        {repos?.data && (
          <div>
            {repos.data.map((repo) => (
              <div key={repo.id}>
                {repo.name}{" "}
                <a href={repo.html_url} target="_blank" rel="noreferrer">
                  Link
                </a>
              </div>
            ))}
            <button
              onClick={() => {
                fetcher.fetch<Repo[]>({
                  url: "https://api.github.com/users/edelyn/repos",
                  excludeBaseUrl: true,
                  method: "GET",
                  onChange(event, data) {
                    if (event === "start") {
                      setRepos({ loading: true });
                    } else if (
                      event === "end" &&
                      !(data instanceof FetchError)
                    ) {
                      setRepos({ loading: false, data });
                    } else if (
                      event === "error" &&
                      data instanceof FetchError
                    ) {
                      setRepos({ loading: false, error: data });
                    }
                  },
                });
              }}
            >
              Reload
            </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
export default UseLoadState;
