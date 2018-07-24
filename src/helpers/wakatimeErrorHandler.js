import createErrorMessage from './createErrorMessage';
import { productionConstants } from '../config/constants';


const { ERROR_CODES } = productionConstants;

const wakatimeErrorHandlers = (e) => {
  switch (e.response.status) {
    case ERROR_CODES.BAD_REQUEST:
      return createErrorMessage('Bad Request');
    case ERROR_CODES.UNAUTHORIZED:
      return createErrorMessage('Unauthorized');
    case ERROR_CODES.FORBIDDEN:
      return createErrorMessage('You don\'t have permissions to access this section!');
    case ERROR_CODES.NOT_FOUND:
      return createErrorMessage('Not found');
    case ERROR_CODES.TOO_MANY_REQUESTS:
      return createErrorMessage('Too many requests');
    case ERROR_CODES.SERVER_ERROR:
      return createErrorMessage('Server error');
    default:
      return createErrorMessage('Caught an error while making API request to WakaTime');
  }
};

export default wakatimeErrorHandlers;
