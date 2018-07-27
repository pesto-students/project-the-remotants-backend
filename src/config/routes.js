const apiRoute = '/api';
const managerRoute = '/manager';

const routes = {
  Home: '/',
  Test: '/test',
  Auth: '/auth',
  Dashboard: '/dashboard',
  InviteAuth: '/invite/auth',
};

const authRoutes = {
  Register: '/register',
  Login: '/login',
  GitHub: '/github/authenticate/:code',
  WakaTime: '/wakatime/authenticate/:code',
};

const organisationRoutes = {
  Setup: '/setup',
  Update: '/update/:id',
  Get: '/:id',
  List: '/list',
  Invite: '/invite',
  Manager: {
    List: `${managerRoute}/list`,
  },
};

const dashboardRoutes = {
  BasicSetup: '/setup-1',
  OAuthSetup: '/setup-2',
  Organisation: '/organisation',
  WakaTime: `${apiRoute}/wakatime`,
  GitHub: `${apiRoute}/github`,
  User: '/user',
};

const userRoutes = {
  Get: '/:id',
};

const WakaTimeApiUrl = 'https://wakatime.com/api/v1';

const wakatimeRoutes = {
  Projects: '/users/current/projects',
  ProjectCommits: '/users/current/projects/:project/commits',
  Durations: '/users/current/durations',
  UserDetails: '/users/current',
  OrganisationMemberStats: '/users/all/:userID',
  Stats: '/users/current/stats/:dateRange',
  Summaries: '/users/current/summaries',
  IfTokenExists: '/users/checkToken',
};

const wakatimeApiRoutes = {
  Projects: `${WakaTimeApiUrl}/users/current/projects`,
  Durations: `${WakaTimeApiUrl}/users/current/durations`,
  UserDetails: `${WakaTimeApiUrl}/users/current`,
  Stats: `${WakaTimeApiUrl}/users/current/stats`,
  Summaries: `${WakaTimeApiUrl}/users/current/summaries`,
};

const GitHubApiUrl = 'https://api.github.com';

const githubRoutes = {
  Issues: '/user/issues',
  Repos: '/user/repos',
  RepoPullRequests: '/user/repos/:owner/:repo/pulls',
  IfTokenExists: '/users/checkToken',
  CurrentUser: '/user',
};

const githubApiRoutes = {
  Issues: `${GitHubApiUrl}/user/issues`,
  Repos: `${GitHubApiUrl}/user/repos`,
  RepoPullRequests: `${GitHubApiUrl}/repos`,
  CurrentUser: `${GitHubApiUrl}/user`,
};

export {
  authRoutes,
  dashboardRoutes,
  organisationRoutes,
  wakatimeRoutes,
  wakatimeApiRoutes,
  githubRoutes,
  githubApiRoutes,
  userRoutes,
};

export default routes;
