import { verifyToken } from '../helpers';


export default async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  let token;

  if (authorizationHeader) {
    [, token] = authorizationHeader.split(' ');
  }
  if (token) {
    try {
      const { success, user, errors } = await verifyToken(token);
      if (success === true) {
        req.currentUser = user;
        next();
      } else {
        res.json(errors);
      }
    } catch (e) {
      res.json({
        name: 'Caught an error at the time of verifying token.',
      });
    }
  } else {
    res.json({
      name: 'No token provided',
    });
  }
};
