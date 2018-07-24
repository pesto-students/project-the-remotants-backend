import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import inviteAuthRoutes from './routes/inviteAuth';
import { productionConstants } from './config/constants';
import routes from './config/routes';

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(json());
app.use(urlencoded({
  extended: true,
}));

app.use(routes.Auth, authRoutes);
app.use(routes.Dashboard, dashboardRoutes);
app.use(routes.InviteAuth, inviteAuthRoutes);

app.get(routes.Home, (req, res) => {
  res.send("Roll over to /test to see it it's working or not");
});

app.get(routes.Test, (req, res) => {
  res.json({ status: 'Working!' });
});

const server = app.listen(productionConstants.PORT, () => {
  console.log(`Backend is running on PORT: ${productionConstants.PORT}`);
});

export default server;
