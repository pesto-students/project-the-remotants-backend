import jwt from 'jsonwebtoken';

import { getDb } from '../database';
import { productionConstants } from '../config/constants';
import { organisationExists } from './handleOrganisation';
import createErrorMessage from '../helpers/createErrorMessage';
import createSuccessMessage from '../helpers/createSuccessMessage';


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

const verifyInviteToken = async (token) => {
  const res = await jwt.verify(token, productionConstants.SECRET, async (err, decoded) => {
    if (err) {
      return createErrorMessage('Failed to authenticate');
    }
    const {
      organisation,
    } = decoded;

    const db = await getDb();
    try {
      const response = await organisationExists(
        db,
        productionConstants.ORGANISATIONS_COLLECTION,
        organisation,
      );
      if (response === null) {
        return createErrorMessage('No such organisation');
      }

      return createSuccessMessage('data', decoded);
    } catch (e) {
      return createErrorMessage('Caught an error while checking if the organisation exists or not.');
    }
  });
  return res;
};

export {
  createInviteToken,
  verifyInviteToken,
};
