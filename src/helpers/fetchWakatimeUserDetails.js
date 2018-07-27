import axios from 'axios';

import { wakatimeApiRoutes } from '../config/routes';
import createSuccessMessage from './createSuccessMessage';
import createErrorMessage from './createErrorMessage';
import wakatimeErrorHandler from './wakatimeErrorHandler';


const wakatimeUserDetails = async (token) => {
  const axiosConfig = {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  try {
    const axiosResponse = await axios(wakatimeApiRoutes.UserDetails, axiosConfig);
    const { data } = axiosResponse.data;
    return createSuccessMessage('data', data);
  } catch (e) {
    if (e.response === undefined) {
      return createErrorMessage('Caught an error while making API request to WakaTime');
    }

    return wakatimeErrorHandler(e);
  }
};

export default wakatimeUserDetails;
