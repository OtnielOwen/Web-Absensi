import { useEffect, useMemo, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import useFetchApi from './useFetchApi';
import useToastError from './useToastError';

/**
 * @typedef {Object} QueryFetchBaseArgs
 * @property {boolean | null} enabled
 * @property {boolean | number} retry
 * @property {boolean} isToastError
 * @property {number} cacheTime
 */

/**
 * @param {import('../fetchApi').FetchOption & QueryFetchBaseArgs} param
 */
const useQueryFetch = ({
  url,
  payload = {},
  params = {},
  headers = {},
  method = 'GET',
  retry = false,
  onSuccess = null,
  enabled = null,
  isUseAuth = true,
  isToastError = true,
  cacheTime = 0,
  ...rest
}) => {
  const abortRef = useRef(new AbortController());
  const fetchApi = useFetchApi({
    url,
    method,
    headers,
    payload,
    params,
    onSuccess,
    isUseAuth,
    signal: abortRef.current.signal,
    ...rest,
  });

  const queryKey = useMemo(
    () => [
      url,
      ...(Object.keys(params).length > 0 ? [params] : []),
      ...(Object.keys(payload).length > 0 ? [payload] : []),
    ],
    [url, JSON.stringify(params), JSON.stringify(payload)]
  );

  const {
    data,
    error,
    isFetching: isLoading,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: fetchApi,
    retry,
    cacheTime,
    ...(enabled !== null && { enabled }),
  });

  useEffect(() => {
    return () => {
      abortRef.current?.abort?.();
    };
  }, []);

  const errMessage = error?.message || null;

  useToastError(isToastError ? errMessage : null);

  return {
    data,
    isLoading,
    errMessage,
    refetch,
  };
};

export default useQueryFetch;
