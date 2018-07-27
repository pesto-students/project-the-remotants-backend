import jwt from 'jsonwebtoken';

import { productionConstants } from '../config/constants';


const createInviteToken = (email, managerFlag, organisationID) => {
  const token = jwt.sign(
    {
      email,
      manager: managerFlag,
      organisation: organisationID,
    },
    productionConstants.SECRET,
    {
      expiresIn:
      Math.floor(Date.now() / 1000) + (+productionConstants.ONE_HOUR),
    },
  );
  return token;
};

export default createInviteToken;
