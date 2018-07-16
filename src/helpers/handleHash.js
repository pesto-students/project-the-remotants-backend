import bcrypt from 'bcrypt';

import { productionConstants } from '../config/constants';

const generateHash = async (plainText) => {
  const hash = await bcrypt.hash(plainText, (Number(productionConstants.SALT_ROUNDS)));
  return hash;
};

const compareHash = async (plainText, hash) => {
  const match = await bcrypt.compare(plainText, hash);
  return match;
};

export {
  generateHash,
  compareHash,
};
