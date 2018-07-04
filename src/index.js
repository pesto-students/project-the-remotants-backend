import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';

import authRoutes from './routes/auth';
import dashboardRoutes from './routes/dashboard';
import { productionConstants } from './config/constants';


const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(json());
app.use(urlencoded({
  extended: true,
}));

app.use('/auth', authRoutes);
app.use('/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send("Roll over to /test to see it it's working or not");
});

app.get('/test', (req, res) => {
  res.json({ status: 'Working!' });
});

const server = app.listen(productionConstants.PORT, () => {
  console.log(`Backend is running on PORT: ${productionConstants.PORT}`);
});

export default server;
