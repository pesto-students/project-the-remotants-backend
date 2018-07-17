const routes = {
  Home: '/',
  Test: '/test',
  Auth: '/auth',
  Dashboard: '/dashboard',
};

const authRoutes = {
  Register: '/register',
  Login: '/login',
  Setup: '/setup',
};

const dashboardRoutes = {
  GetUser: '/user/:id',
  UserSetup: '/setup',
  GetOrganisation: '/org/:id',
  OrganisationSetup: '/orgSetup',
  OrganisationUpdate: '/orgUpdate/:id',
};

export { authRoutes, dashboardRoutes };
export default routes;
