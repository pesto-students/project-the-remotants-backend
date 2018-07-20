const apiRoute = '/api';

const routes = {
  Home: '/',
  Test: '/test',
  Auth: '/auth',
  Dashboard: '/dashboard',
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
};

const wakatimeApiRoutes = {
  Projects: `${WakaTimeApiUrl}/users/current/projects`,
};

const GitHubApiUrl = 'https://api.github.com';

const githubRoutes = {
  Issues: '/user/issues',
};

const githubApiRoutes = {
  Issues: `${GitHubApiUrl}/user/issues`,
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
