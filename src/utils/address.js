export const tokens = [
  {
    name: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimal: 6,
  },
  {
    name: "CRV",
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    decimal: 18,
  },
  {
    name: "WETH",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimal: 18,
  },
  {
    name: "ALCX",
    address: "0xdbdb4d16eda451d0503b854cf79d55697f90c8df",
    decimal: 18,
  },
  {
    name: "NOTE",
    address: "0xCFEAead4947f0705A14ec42aC3D44129E1Ef3eD5",
    decimal: 8,
  },
  {
    name: "CVX",
    address: "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
    decimal: 18,
  },
  {
    name: "LDO",
    address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    decimal: 18,
  },
];

export const getTokenNameFromAddress = (token) => {
  const index = tokens
    .map((t) => t.address.toLowerCase())
    .indexOf(token.toLowerCase());
  if (index < 0) return null;
  else return tokens[index].name;
};

export const getTokenDecimalFromAddress = (token) => {
  const index = tokens
    .map((t) => t.address.toLowerCase())
    .indexOf(token.toLowerCase());
  if (index < 0) return null;
  else return tokens[index].decimal;
};

export const uniV2Router = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export const uniV3Router = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
export const uniV3Quoter = "0x61fFE014bA17989E743c5F6cB21bF9697530B21e";
export const sushiV2Router = "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F";
export const curveCRVETHPool = "0x8301ae4fc9c624d1d396cbdaa1ed877821d7c511";
export const curveCVXETHPool = "0xB576491F1E6e5E62f1d8F26062Ee822B40B0E0d4";
export const curve3Pool = "0xfA9a30350048B2BF66865ee20363067c66f67e58";
export const curve3Null = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
