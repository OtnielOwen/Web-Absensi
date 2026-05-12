import { useCallback } from 'react';
import fetchApi from '../fetchApi';

/** @param {import('../fetchApi').FetchOption} param  */
const useFetchApi = (param) => {
  /**
   * @param {object} payload
   * @param {object} headers
   * @param {import('axios').AxiosRequestConfig<any>} axiosConfig
   * @returns {Promise<any>}
   */
  return useCallback(
    (payload = {}, headers = {}, axiosConfig = {}) =>
      fetchApi({
        ...param,
        ...(payload && { payload }),
        ...(headers && { headers }),
        ...(axiosConfig && { ...axiosConfig }),
      }),
    [JSON.stringify(param)]
  );
};

export default useFetchApi;
