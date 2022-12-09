import Web3 from "web3";
import { numberWithCommas } from "@/utils";
// import Vue from 'vue'

const infuraURI =
  "https://mainnet.infura.io/v3/cc3e879fa2e34c7d9dc0fc9612fc9bd4";

// const infuraURI = "http://localhost:8545/";
Vue.prototype.$web3 = new Web3(new Web3.providers.HttpProvider(infuraURI));

Vue.prototype.$nameFixed = (num, name) => {
  if (!Number(num)) return 0;
  const wei = name === "USDC" ? 2 : name === "ETH" ? 3 : 4;
  return numberWithCommas(new BigNumber(num).toFixed(wei, 1));
};

Vue.prototype.$numFixed = (val, key = 0) => {
  return key !== 0
    ? new BigNumber(val).multipliedBy(100).toFixed(2, 1)
    : new BigNumber(val).toFixed(2, 1);
};

Vue.prototype.$feeRatio = (val) => {
  if (!Number(val)) return 0;
  return new BigNumber(val).multipliedBy(100).toFixed(0, 1);
};
