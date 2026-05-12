import { AxiosError } from 'axios';
import { saveAs } from 'file-saver';
import api from './api';
import { getAuthHeader } from './authorization';

/**
 * @typedef {Object} FetchRequest
 * @property {string} url
 * @property {Object} params
 * @property {Object} payload
 * @property {Object} headers
 * @property {'POST' | 'GET' | 'PUT' | 'DELETE'} method
 * @property {boolean} isUseAuth
 */

/**
 * @typedef {Object} FetchCallback
 * @property {(data: Object, request: FetchRequest) => Object} onSuccess
 * @property {(err: Object, request: FetchRequest) => void} onError
 */

/** @typedef {FetchRequest & FetchCallback & import('axios').AxiosRequestConfig<any>} FetchOption */

/** @type {(payload: Object) => boolean} */
function isPayloadHasFile(payload) {
  return Object.values(payload).some((value) => {
    if (Array.isArray(value)) {
      return value.every((v) => v instanceof File);
    }

    return value instanceof File;
  });
}

/** @type {(payload: Object) => FormData} */
function convertPayloadToFormData(payload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => formData.append(`${key}[]`, v));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
}

/** @type {(response: AxiosResponse<any, any>) => boolean} */
function isResponseFile({ headers }) {
  const isFileContentTypes = [
    'application/octet-stream',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
  ];

  return isFileContentTypes.includes(headers['content-type']);
}

/** @type {(response: AxiosResponse<any, any>) => string} */
function handleFileDownload({ headers, data }) {
  const fileName = headers['x-suggested-filename'];

  if (!fileName) {
    throw new Error('Gagal download: nama file tidak ditemukan');
  } else if (!(data instanceof Blob)) {
    throw new Error('Gagal download: data tidak valid');
  }

  const blobUrl = URL.createObjectURL(data);
  saveAs(blobUrl, fileName);
  return blobUrl;
}

/** @type {(opt: FetchOption) => Promise<any>} */
function fetchApi({
  url,
  method,
  payload = {},
  params = {},
  headers = {},
  onSuccess,
  onError,
  isUseAuth = true,
  signal,
  ...rest
} = {}) {
  return new Promise((resolve, reject) => {
    /** @type {FetchRequest} */
    const request = { url, method, headers, params, isUseAuth, payload };
    const isFormData = isPayloadHasFile(payload);

    headers = {
      ...headers,
      ...(isUseAuth && getAuthHeader()),
    };

    if (isFormData) {
      payload = convertPayloadToFormData(payload);
      headers = {
        ...headers,
        'content-type': 'multipart/form-data',
      };
    }

    /** @type {Promise<import('axios').AxiosResponse<any, any>>} */
    let axiosFetch = null;

    if (isFormData) {
      const httpMethod = method.toLowerCase();
      axiosFetch = api[httpMethod](url, payload, {
        ...(Object.keys(params).length > 0 && { params }),
        headers,
        signal,
        ...rest,
      });
    } else {
      axiosFetch = api({
        ...(Object.keys(payload).length > 0 && { data: payload }),
        ...(Object.keys(params).length > 0 && { params }),
        headers,
        method,
        url,
        signal,
        ...rest,
      });
    }

    axiosFetch
      .then((res) => {
        const { data } = res;
        if (isResponseFile(res)) {
          resolve(handleFileDownload(res));
          return;
        }

        if (typeof data?.success === 'boolean' && data?.success === false) {
          throw new AxiosError(
            data?.message || 'Terjadi kesalahan, silahkan coba beberapa saat lagi',
            data?.code || res.status || 500,
            res.config,
            res.request,
            res
          );
        }

        if (onSuccess) {
          resolve(onSuccess(data, request));
          return;
        }
        resolve(data?.data || data);
      })
      .catch((e) => {
        const errResult = onError?.(e, request);

        if (typeof errResult === 'boolean' && errResult === false) {
          reject();
          return;
        }

        const errorMessage =
          (typeof errResult === 'string' ? errResult : null) ||
          (typeof e?.response?.error === 'string' ? e.response.error : null) ||
          e?.response?.data?.message ||
          e?.message ||
          'Terjadi kesalahan, silahkan coba beberapa saat lagi';

        reject(errorMessage);
      });
  });
}

export default fetchApi;
