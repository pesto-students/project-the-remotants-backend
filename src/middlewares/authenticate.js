import { verifyToken } from '../helpers/handleToken';
import createErrorMessage from '../helpers/createErrorMessage';


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
        // gets the email as currentUser
        req.currentUser = user.email;
        next();
      } else {
        res.json(errors);
      }
    } catch (e) {
      const error = createErrorMessage('Caught an error at the time of verifying token.');
      res.json(error);
    }
  } else {
    const error = createErrorMessage('No token provided');
    res.json(error);
  }
};
