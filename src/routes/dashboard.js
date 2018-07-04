import express from 'express';

import authenticate from '../middlewares/authenticate';

const route = express.Router();

route.get('/', authenticate, (req, res) => {
  res.json({ success: true });
});

export default route;
