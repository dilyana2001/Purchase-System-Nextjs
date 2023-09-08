import axios from "axios";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";

const querify = (query) =>
  Object.keys(query)
    .map((key) => {
      const queryValue = query[key];
      if (Array.isArray(queryValue)) {
        const statements = [];
        queryValue.forEach((value) => {
          statements.push(
            `${encodeURIComponent(key)}[]=${encodeURIComponent(value)}`
          );
        });

        return statements.join("&");
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(queryValue)}`;
    })
    .join("&");

export const getUrl = (url, query) => {
  if (isEmpty(query)) return url;

  return `${url}?${querify(query)}`;
};

const getConfig = (config, token) => {
  if (isEmpty(token)) return { ...config };

  const headers = isObject(config.headers)
    ? { ...config.headers, Authorization: `Bearer ${token}` }
    : { Authorization: `Bearer ${token}` };

  return { ...config, headers };
};

const get = (url, query = {}, config = {}, token = null) =>
  axios.get(getUrl(url, query), getConfig(config, token)).then((res) => res);

const create = (url, data = {}, config = {}, token = null) =>
  axios.post(url, data, getConfig(config, token)).then((res) => res);

const update = (url, data = {}, config = {}, token = null) =>
  axios.put(url, data, getConfig(config, token)).then((res) => res);
  
const upload = (url, data = {}, config = {}, token = null) =>
  axios.patch(url, data, getConfig(config, token)).then((res) => res);

const remove = (url, config = {}, token = null) =>
  axios.delete(url, getConfig(config, token)).then((res) => res);

const api = {
  get,
  create,
  update,
  upload,
  remove,
};

export default api;
