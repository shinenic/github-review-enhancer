import useGithubQuery from './useGithubQuery'

export const useQueryRepoInfo = ({ owner, repo, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}',
    placeholders: { owner, repo },
    ...rest,
  })
}

export const useQueryCommits = ({ owner, repo, PR, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/pulls/{PR}/commits',
    placeholders: { owner, repo, PR },
    ...rest,
  })
}

export const useQueryCommit = ({ owner, repo, commit, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/pulls/commit/{commits}',
    placeholders: { owner, repo, commit },
    ...rest,
  })
}

export const useQueryPR = ({ owner, repo, PR, perPage = 100, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/pulls/{PR}/files',
    placeholders: { owner, repo, PR },
    params: { per_page: perPage },
    ...rest,
  })
}

export const useQueryPRs = ({
  owner,
  repo,
  perPage = 30,
  sort = 'created',
  direction = 'desc',
  state = 'open',
  ...rest
}) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/pulls',
    placeholders: { owner, repo },
    params: {
      sort: 'created',
      direction: 'desc',
      state: 'open',
      per_page: perPage,
    },
    ...rest,
  })
}

export const useQueryFiles = ({ owner, repo, branch, ...rest }) => {
  return useGithubQuery({
    url: '/repos/{owner}/{repo}/git/trees/{branch}',
    placeholders: { owner, repo, branch },
    params: { recursive: 1 },
    ...rest,
  })
}
