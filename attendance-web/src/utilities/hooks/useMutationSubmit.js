import { useMutation } from '@tanstack/react-query';
import useFetchApi from './useFetchApi';
import useToastError from './useToastError';

/**
 * @param {import("./useFetchApi").FetchOption & { isToastError: boolean; retry: number | boolean }} param
 */
const useMutationSubmit = ({
  url,
  method = 'POST',
  headers,
  payload,
  params,
  isUseAuth = true,
  isToastError = true,
  onSuccess,
  onError,
  retry = false,
  ...rest
}) => {
  const submitFn = useFetchApi({
    url,
    method,
    headers,
    payload,
    params,
    onSuccess,
    onError,
    isUseAuth,
    ...rest,
  });

  const {
    mutate: submit,
    data,
    status,
    isError,
    isSuccess,
    error,
  } = useMutation({ mutationFn: submitFn, retry });

  const errMessage = error || null;

  useToastError(isToastError ? errMessage : null);

  return {
    submit,
    data,
    isLoading: status === 'pending',
    isError,
    isSuccess,
    errMessage,
  };
};

export default useMutationSubmit;
