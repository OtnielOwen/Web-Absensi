import moment from 'moment';
import CONSTANT from './constant';

/**
 * @param {moment.Moment | string | Date} date
 * @param {object} option
 * @param {string} option.dateFormat
 * @param {string} option.defaultValue
 * @returns {string}
 */
export const dateFormat = (date, { dateFormat, defaultValue = '' } = {}) => {
  if (typeof date === 'string' || date instanceof Date) {
    date = moment(date);

    if (!date.isValid()) return defaultValue;
  }

  if (!date) return defaultValue;

  return date.format(dateFormat || CONSTANT.DATE_FORMAT);
};

/**
 * @param {string | Date} date
 * @param {string | string[] | null} format
 * @returns {moment.Moment | null}
 */
export const convertToMoment = (date, format = null) => {
  let result = null;

  if (date) {
    result = format ? moment(date, format) : moment(date);

    if (!result?.isValid()) return null;
  }

  return result;
};
