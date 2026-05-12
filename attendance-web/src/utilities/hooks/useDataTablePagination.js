import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useQueryFetch from '@/utilities/hooks/useQueryFetch';

const defaultGeneratedParams = {
  search: 'q',
};

/**
 * @param {Object} props
 * @param {string} props.dataSourceUrl
 * @param {string} props.searchQueryKey
 * @param {(data: Object) => Object | Array} props.onFetchSuccess
 * @param {Object} props.generatedParamsKey
 * @param {Object} props.defaultParams
 * @param {number} props.defaultParams.page
 * @param {number} props.defaultParams.limit
 */

function useDataTablePagination({
  dataSourceUrl,
  defaultParams = { page: 1, limit: 10 },
  onFetchSuccess,
  ...rest
} = {}) {
  const [params, setParams] = useSearchParams(defaultParams);
  const paramsObj = useMemo(() => Object.fromEntries(params.entries()), [params]);

  const query = useQueryFetch({
    url: dataSourceUrl,
    params: { ...paramsObj },
    enabled: Boolean(dataSourceUrl),
    onSuccess: (data) => {
      return onFetchSuccess?.(data) || data;
    },
  });

  /** @type {import('@/types').BaseResponse<import('@/types').BaseDataResponse[]>} */
  const queryResult = query.data || {};

  /**
   * @param {number} page
   * @param {number} limit
   */
  const goToPage = (page, limit) => {
    if (typeof page !== 'number') return;

    const isPerPageChanged = limit !== Number(paramsObj.limit);

    setParams({
      ...paramsObj,
      limit,
      page: isPerPageChanged ? 1 : page,
    });
  };

  const generatedParamsKey = useMemo(
    () => ({ ...defaultGeneratedParams, ...rest.generatedParamsKey }),
    [rest.generatedParamsKey]
  );

  const validateNextParams = useCallback(
    (nextParams) =>
      Object.entries({
        ...paramsObj,
        ...nextParams,
      }).reduce(
        (acc, [key, value]) => ({
          ...acc,
          ...(value !== '' &&
            value !== null &&
            value !== undefined && {
              [key]: value,
            }),
        }),
        {}
      ),
    [paramsObj]
  );

  console.log(generatedParamsKey);

  const generatedParamsHelper = useMemo(
    () =>
      Object.entries(generatedParamsKey)
        .map(([aliasName, realParamName]) => ({
          [`${aliasName}Query`]: paramsObj?.[realParamName],
          [`${aliasName}ByQuery`](value) {
            setParams({
              ...validateNextParams({
                [realParamName]: value,
              }),
              page: 1,
            });
          },
        }))
        .reduce((acc, item) => ({ ...acc, ...item }), {}),
    [generatedParamsKey, paramsObj, setParams, validateNextParams]
  );

  console.log(generatedParamsHelper);

  return {
    ...generatedParamsHelper,
    pagination: queryResult?.pagination,
    isLoading: query.isLoading,
    data: queryResult?.data || [],
    refetch: query.refetch,
    goToPage,
    setByQuery: (nextParams = {}) => {
      setParams({
        ...validateNextParams(nextParams),
        page: 1,
      });
    },
    nextPage: () => goToPage(queryResult?.pagination?.next, queryResult?.pagination?.per_page),
    prevPage: () => goToPage(queryResult?.pagination?.prev, queryResult?.pagination?.per_page),
  };
}

export default useDataTablePagination;
