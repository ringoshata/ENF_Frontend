import qs from "qs";
import fetch from "../utils/Fetch";
import { API_URL, API_V3_URL, Network } from "../config.js";
const NET = "m";
// const NET = Network === 1 ? 'm' : ''
const URL = API_URL + "/" + NET;
// const API_URL = 'http://10.10.10.207:8581'
const getAsset = (data, code = "") => {
  return fetch({
    url: `${URL + code}/getAsset`,
    method: "POST",
    data: qs.stringify({ address: data }),
  });
};
const getProfit = (code = "") => {
  return fetch({
    url: `${URL + code.toLowerCase()}/profit`,
    method: "POST",
  });
};
const getTransaction = (data, code = "") => {
  return fetch({
    url: `${URL + code}/transaction`,
    method: "POST",
    data: qs.stringify(data),
  });
};
//首页
const getSevendayProfit = (code) => {
  return fetch({
    url: `${URL + code}/getAsset`,
    method: "POST",
    data: qs.stringify({ firstpage: true }),
  });
};

const registerTx = async (data) => {
  return fetch({
    url: `${API_V3_URL}/register_tx`,
    method: "POST",
    data: data,
  });
};

const fetchTxs = async (code, address) => {
  const checkSummed = Vue.prototype.$web3.utils.toChecksumAddress(address);
  return fetch({
    url: `${API_V3_URL}/user_tx/${code}/${checkSummed}`,
    method: "GET",
  });
};

const fetchTotalHis = async (address, period) => {
  return fetch({
    url: `${API_V3_URL}/total_assets/${address}/${period}`,
    method: "GET",
  });
};

export {
  getAsset,
  getProfit,
  getTransaction,
  getSevendayProfit,
  registerTx,
  fetchTxs,
  fetchTotalHis,
};
