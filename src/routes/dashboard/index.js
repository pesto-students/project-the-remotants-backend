import express from 'express';

import authenticate from '../../middlewares/authenticate';

import routes, { dashboardRoutes } from '../../config/routes';
import basicSetupRoutes from './basicSetup';
import oauthSetupRoutes from './oauthSetup';
import orgRoutes from './organisation';
import wakatimeRoutes from './wakatime';
import UserRoutes from './user';
import createSuccessMessage from '../../helpers/createSuccessMessage';


const route = express.Router();

route.use(authenticate);

route.use(dashboardRoutes.BasicSetup, basicSetupRoutes);
route.use(dashboardRoutes.OAuthSetup, oauthSetupRoutes);
route.use(dashboardRoutes.Organisation, orgRoutes);
route.use(dashboardRoutes.WakaTime, wakatimeRoutes);
route.use(dashboardRoutes.User, UserRoutes);

route.get(routes.Home, (req, res) => {
  res.json(createSuccessMessage());
});

export default route;
