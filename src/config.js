//blocknative 库配置
const Wallets = [
  {
    walletName: "metamask",
    preferred: true,
  },
  {
    walletName: "walletConnect",
    infuraKey: "9aa3d95b3bc440fa88ea12eaa4456161",
    preferred: true,
  },
];
const TTIMER = [20000, 30000];
const DappId = "48bec8e3-294f-42f5-9c94-0f657ed9db49";

let Network = 3;
let Contract = {};
let HContract = {};
let NContract = {};
let HNContract = {};
let PContract = {};
let LPoolContract = {};
let HPoolContract = {};
let API_URL = "";
let API_V3_URL = "";
let OPEN_URL = "";
let HMarkets = [];
let LMarkets = [];
let NMarkets = [];
let HNMarkets = [];
let PMarkets = [];
let InfuraURI = "";

//switch ("production") {
switch (process.env.NODE_ENV) {
  // 测试环境
  case "development":
    API_URL = "https://api.earning.farm";
    API_V3_URL = "https://api-v3test.earning.farm/v1";
    OPEN_URL = "https://etherscan.io/tx/";
    InfuraURI = "http://localhost:8545/";
    Network = 1;
    LMarkets = ["usdc"];
    HMarkets = ["usdc", "eth"];
    NMarkets = ["eth"];
    PMarkets = ["usdc"]
    // NMarkets = ["usdc", "eth"];
    HNMarkets = ["eth", "wbtc"];
    Contract = {
      USDC: {
        CFToken: "0x412EbDc655f897e0eC0f89022bc7DEC62BAaE0aF",
        ERC20DepositApprover: "0xe5afC078684683dc232E053c2c9D86015Aa00Ec6",
        CFVault: "0x889B9194Fb1D66509d3d043e7c839582fED6E607",
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        Decimal: 1e6,
        Name: "稳定币去中心化收益基金",
        Introduce:
            "基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
      WBTC: {
        CFToken: "0x2Eb8e7fEeC11D6dCE4799AfA3b7Bb83BbA02b081",
        ERC20DepositApprover: "0xe5afC078684683dc232E053c2c9D86015Aa00Ec6",
        CFVault: "0xAFcf9Ec311c42b4221697cf7F5392f9110DC8e8c",
        WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        Decimal: 1e8,
        Name: "BTC去中心化收益基金",
        Introduce:
            "基于Curve的多个BTC ERC20池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
      ETH: {
        CFToken: "0xA709eCF2253B18A757214D64F42026Be8F008bD8",
        CFVault: "0xE303a8Cc37C96669C7Ba5aeE1134bb530e766BdF",
        Decimal: 1e18,
        Name: "ETH去中心化收益基金",
        Introduce:
            "基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
    };

    HContract = {
      USDC: {
        CFToken: "0xfF55c4e42D7C2c4f9fd251f62b3469Fb2783954F",
        CFVault: "0x16b0C918B4aEE4Fa87AE20576A369723A3A7F648",
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        CRV: "0xD533a949740bb3306d119CC777fa900bA034cd52",
        USDCDecimal: 1e6,
        CRVDecimal: 1e18,
        Length: 2,
        Name: "稳定币去中心化收益基金",
        Introduce:
            "基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
      ETH: {
        CFToken: "0xBAe7EC1BAaAe7d5801ad41691A2175Aa11bcba19",
        CFVault: "0xe39fd820B58f83205Db1D9225f28105971c3D309",
        Decimal: 1e18,
        Name: "ETH去中心化收益基金",
        Introduce:
            "基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
    };

    NContract = {
      USDC: {
        depositApprover: "0x2D39B83dd6e865cA005e35d630e1f6735118d5d4",
        vault: "0xBDB515028A6fA6CD1634B5A9651184494aBfD336",
        controller: "0xf491AfE5101b2eE8abC1272FA8E2f85d68828396",
        asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        CRV: "0xD533a949740bb3306d119CC777fa900bA034cd52",
        Decimal: 1e6,
        assetDecimal: 6,
        CRVDecimal: 1e18,
      },
      ETH: {
        vault: "0x5AdA9cEa5d3A7805ee63037306BC0C02a512e4E3",
        controller: "0x6D2AEd3EBA5F32E55782b70eCc90456977ec2020",
        asset: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        Decimal: 1e18,
        assetDecimal: 18,
      },
    };

    HNContract = {
      ETH: {
        vault: "0x5655c442227371267c165101048E4838a762675d",
        controller: "0xE8688D014194fd5d7acC3c17477fD6db62aDdeE9",
        asset: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        Decimal: 1e18,
        assetDecimal: 18,
      },
      WBTC: {
        depositApprover: "0x1f5a23C77f589DBe5d597F9B2F1C834945b45C90",
        vault: "0xeb7621B1119fB5A77dF8A9758cA946Fc213C611A",
        controller: "0x00B22718F0376Eae0F5476799b6026f18C012514",
        asset: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        Decimal: 1e8,
        assetDecimal: 8,
      },
    };

    PContract = {
      USDC: {
        vault: "0x1d0993A22BF52D942c3F4CDa1922Cb9f0A4F94C2",
        asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        lpToken: "0xBDB515028A6fA6CD1634B5A9651184494aBfD336",
        Decimal: 1e18,
        assetDecimal: 6
      }
    }
    // API_URL = "https://api.earning.farm";
    // API_V3_URL = "http://localhost:3030/v1";
    // OPEN_URL = "https://etherscan.io/tx/";
    // InfuraURI = "http://localhost:8545/";
    // Network = 31337;
    // LMarkets = ["usdc"];
    // HMarkets = ["usdc", "eth"];
    // NMarkets = ["usdc"];
    // HNMarkets = ["wbtc"];
    // Contract = {
    //   USDC: {
    //     CFToken: "0x412EbDc655f897e0eC0f89022bc7DEC62BAaE0aF",
    //     ERC20DepositApprover: "0xe5afC078684683dc232E053c2c9D86015Aa00Ec6",
    //     CFVault: "0x889B9194Fb1D66509d3d043e7c839582fED6E607",
    //     USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    //     Decimal: 1e6,
    //     Name: "稳定币去中心化收益基金",
    //     Introduce:
    //       "基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
    //   },
    //   WBTC: {
    //     CFToken: "0x2Eb8e7fEeC11D6dCE4799AfA3b7Bb83BbA02b081",
    //     ERC20DepositApprover: "0xe5afC078684683dc232E053c2c9D86015Aa00Ec6",
    //     CFVault: "0xAFcf9Ec311c42b4221697cf7F5392f9110DC8e8c",
    //     WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    //     Decimal: 1e8,
    //     Name: "BTC去中心化收益基金",
    //     Introduce:
    //       "基于Curve的多个BTC ERC20池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
    //   },
    //   ETH: {
    //     CFToken: "0xA709eCF2253B18A757214D64F42026Be8F008bD8",
    //     CFVault: "0xE303a8Cc37C96669C7Ba5aeE1134bb530e766BdF",
    //     Decimal: 1e18,
    //     Name: "ETH去中心化收益基金",
    //     Introduce:
    //       "基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
    //   },
    // };
    //
    // HContract = {
    //   USDC: {
    //     CFToken: "0xfF55c4e42D7C2c4f9fd251f62b3469Fb2783954F",
    //     CFVault: "0x16b0C918B4aEE4Fa87AE20576A369723A3A7F648",
    //     USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    //     CRV: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    //     Decimal: 1e6,
    //     CRVDecimal: 1e18,
    //     Length: 2,
    //     Name: "稳定币去中心化收益基金",
    //     Introduce:
    //       "基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
    //   },
    //   ETH: {
    //     CFToken: "0xBAe7EC1BAaAe7d5801ad41691A2175Aa11bcba19",
    //     CFVault: "0xe39fd820B58f83205Db1D9225f28105971c3D309",
    //     Decimal: 1e18,
    //     Name: "ETH去中心化收益基金",
    //     Introduce:
    //       "基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
    //   },
    // };
    //
    // NContract = {
    //   USDC: {
    //     depositApprover: "0x707531c9999AaeF9232C8FEfBA31FBa4cB78d84a",
    //     vault: "0xdB05A386810c809aD5a77422eb189D36c7f24402",
    //     controller: "0xF66CfDf074D2FFD6A4037be3A669Ed04380Aef2B",
    //     asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    //     CRV: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    //     Decimal: 1e6,
    //     CRVDecimal: 1e18,
    //   },
    // };
    //
    // HNContract = {
    //   WBTC: {
    //     depositApprover: "0xc0c5618f0F3Fa66b496F2940f373DC366d765BAe",
    //     vault: "0xa195ACcEB1945163160CD5703Ed43E4f78176a54",
    //     controller: "0x6212cb549De37c25071cF506aB7E115D140D9e42",
    //     asset: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    //     Decimal: 1e8,
    //     assetDecimal: 8,
    //   },
    // };
    break;

  case "production":
    API_URL = "https://api.earning.farm";
    API_V3_URL = "https://api-v3test.earning.farm/v1";
    OPEN_URL = "https://etherscan.io/tx/";
    InfuraURI = "https://mainnet.infura.io/v3/cc3e879fa2e34c7d9dc0fc9612fc9bd4";
    Network = 1;
    LMarkets = ["usdc"];
    HMarkets = ["usdc", "eth"];
    NMarkets = ["eth"];
    PMarkets = ["usdc"]
    // NMarkets = ["usdc", "eth"];
    HNMarkets = ["eth", "wbtc"];
    Contract = {
      USDC: {
        CFToken: "0x412EbDc655f897e0eC0f89022bc7DEC62BAaE0aF",
        ERC20DepositApprover: "0xe5afC078684683dc232E053c2c9D86015Aa00Ec6",
        CFVault: "0x889B9194Fb1D66509d3d043e7c839582fED6E607",
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        Decimal: 1e6,
        Name: "稳定币去中心化收益基金",
        Introduce:
          "基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
      WBTC: {
        CFToken: "0x2Eb8e7fEeC11D6dCE4799AfA3b7Bb83BbA02b081",
        ERC20DepositApprover: "0xe5afC078684683dc232E053c2c9D86015Aa00Ec6",
        CFVault: "0xAFcf9Ec311c42b4221697cf7F5392f9110DC8e8c",
        WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        Decimal: 1e8,
        Name: "BTC去中心化收益基金",
        Introduce:
          "基于Curve的多个BTC ERC20池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
      ETH: {
        CFToken: "0xA709eCF2253B18A757214D64F42026Be8F008bD8",
        CFVault: "0xE303a8Cc37C96669C7Ba5aeE1134bb530e766BdF",
        Decimal: 1e18,
        Name: "ETH去中心化收益基金",
        Introduce:
          "基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
    };

    HContract = {
      USDC: {
        CFToken: "0xfF55c4e42D7C2c4f9fd251f62b3469Fb2783954F",
        CFVault: "0x16b0C918B4aEE4Fa87AE20576A369723A3A7F648",
        USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        CRV: "0xD533a949740bb3306d119CC777fa900bA034cd52",
        USDCDecimal: 1e6,
        CRVDecimal: 1e18,
        Length: 2,
        Name: "稳定币去中心化收益基金",
        Introduce:
          "基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
      ETH: {
        CFToken: "0xBAe7EC1BAaAe7d5801ad41691A2175Aa11bcba19",
        CFVault: "0xe39fd820B58f83205Db1D9225f28105971c3D309",
        Decimal: 1e18,
        Name: "ETH去中心化收益基金",
        Introduce:
          "基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
      },
    };

    NContract = {
      USDC: {
        depositApprover: "0x2D39B83dd6e865cA005e35d630e1f6735118d5d4",
        vault: "0xBDB515028A6fA6CD1634B5A9651184494aBfD336",
        controller: "0xf491AfE5101b2eE8abC1272FA8E2f85d68828396",
        asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        CRV: "0xD533a949740bb3306d119CC777fa900bA034cd52",
        Decimal: 1e6,
        assetDecimal: 6,
        CRVDecimal: 1e18,
      },
      ETH: {
        vault: "0x5AdA9cEa5d3A7805ee63037306BC0C02a512e4E3",
        controller: "0x6D2AEd3EBA5F32E55782b70eCc90456977ec2020",
        asset: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        Decimal: 1e18,
        assetDecimal: 18,
      },
    };

    HNContract = {
      ETH: {
        vault: "0x5655c442227371267c165101048E4838a762675d",
        controller: "0xE8688D014194fd5d7acC3c17477fD6db62aDdeE9",
        asset: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        Decimal: 1e18,
        assetDecimal: 18,
      },
      WBTC: {
        depositApprover: "0x1f5a23C77f589DBe5d597F9B2F1C834945b45C90",
        vault: "0xeb7621B1119fB5A77dF8A9758cA946Fc213C611A",
        controller: "0x00B22718F0376Eae0F5476799b6026f18C012514",
        asset: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        Decimal: 1e8,
        assetDecimal: 8,
      },
    };

    PContract = {
      USDC: {
        vault: "0x1d0993A22BF52D942c3F4CDa1922Cb9f0A4F94C2",
        asset: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        lpToken: "0xBDB515028A6fA6CD1634B5A9651184494aBfD336",
        Decimal: 1e18,
        assetDecimal: 6
      }
    }

    break;

  // // 生产环境
  // case "production":
  //   API_URL = "https://api.earning.farm";
  //   API_V3_URL = "https://api-v3test.earning.farm";
  //   OPEN_URL = "https://etherscan.io/tx/";
  //   Network = 1;
  //   HMarkets = ["usdc"];
  //   LMarkets = ["usdc", "wbtc", "eth"];
  //   NMarkets = ["usdc"];
  //   Contract = {
  //     USDC: {
  //       CFToken: "0x412EbDc655f897e0eC0f89022bc7DEC62BAaE0aF",
  //       ERC20DepositApprover: "0xe5afC078684683dc232E053c2c9D86015Aa00Ec6",
  //       CFVault: "0x889B9194Fb1D66509d3d043e7c839582fED6E607",
  //       USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  //       Decimal: 1e6,
  //       Name: "稳定币去中心化收益基金",
  //       Introduce:
  //         "基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
  //     },
  //     WBTC: {
  //       CFToken: "0x2Eb8e7fEeC11D6dCE4799AfA3b7Bb83BbA02b081",
  //       ERC20DepositApprover: "0xe5afC078684683dc232E053c2c9D86015Aa00Ec6",
  //       CFVault: "0xAFcf9Ec311c42b4221697cf7F5392f9110DC8e8c",
  //       WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  //       Decimal: 1e8,
  //       Name: "BTC去中心化收益基金",
  //       Introduce:
  //         "基于Curve的多个BTC ERC20池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
  //     },
  //     ETH: {
  //       CFToken: "0xA709eCF2253B18A757214D64F42026Be8F008bD8",
  //       CFVault: "0xE303a8Cc37C96669C7Ba5aeE1134bb530e766BdF",
  //       Decimal: 1e18,
  //       Name: "ETH去中心化收益基金",
  //       Introduce:
  //         "基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
  //     },
  //   };

  //   HContract = {
  //     USDC: {
  //       CFToken: "0xfF55c4e42D7C2c4f9fd251f62b3469Fb2783954F",
  //       CFVault: "0x16b0C918B4aEE4Fa87AE20576A369723A3A7F648",
  //       USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  //       CRV: "0xD533a949740bb3306d119CC777fa900bA034cd52",
  //       USDCDecimal: 1e6,
  //       CRVDecimal: 1e18,
  //       Length: 2,
  //       Name: "稳定币去中心化收益基金",
  //       Introduce:
  //         "基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
  //     },
  //     ETH: {
  //       CFToken: "0xBAe7EC1BAaAe7d5801ad41691A2175Aa11bcba19",
  //       CFVault: "0xe39fd820B58f83205Db1D9225f28105971c3D309",
  //       Decimal: 1e18,
  //       Name: "ETH去中心化收益基金",
  //       Introduce:
  //         "基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。",
  //     },
  //   };
  //   break;
}
// API_URL = 'https://api-hr.earning.farm'
// OPEN_URL = 'https://etherscan.io/tx/'
// Network = 1
// HMarkets = ['usdc', 'eth']
// LMarkets = ['usdc', 'wbtc', 'eth']
// Contract = {
// 	USDC: {
// 		CFToken: '0x412EbDc655f897e0eC0f89022bc7DEC62BAaE0aF',
// 		ERC20DepositApprover: '0xe5afC078684683dc232E053c2c9D86015Aa00Ec6',
// 		CFVault: '0x889B9194Fb1D66509d3d043e7c839582fED6E607',
// 		USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
// 		Decimal: 1e6,
// 		Name: '稳定币去中心化收益基金',
// 		Introduce:
// 			'基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。'
// 	},
// 	WBTC: {
// 		CFToken: '0x2Eb8e7fEeC11D6dCE4799AfA3b7Bb83BbA02b081',
// 		ERC20DepositApprover: '0xe5afC078684683dc232E053c2c9D86015Aa00Ec6',
// 		CFVault: '0xAFcf9Ec311c42b4221697cf7F5392f9110DC8e8c',
// 		WBTC: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
// 		Decimal: 1e8,
// 		Name: 'BTC去中心化收益基金',
// 		Introduce:
// 			'基于Curve的多个BTC ERC20池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。'
// 	},
// 	ETH: {
// 		CFToken: '0xA709eCF2253B18A757214D64F42026Be8F008bD8',
// 		CFVault: '0xE303a8Cc37C96669C7Ba5aeE1134bb530e766BdF',
// 		Decimal: 1e18,
// 		Name: 'ETH去中心化收益基金',
// 		Introduce:
// 			'基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。'
// 	}
// }
// LPoolContract = {
// 	'usdc': '0x7DF468277AbC1cf01744fFA21e4c62B8318918F2',
// 	'wbtc': '0xd525c8582c725d0b2fc0C601E5df60A7181577CC',
// 	'eth': '0x0f5CfB3A503b126B6bCd1Adf5e3C6AB35a48A48B'
// }
// HPoolContract = {
// 	'usdc': '0x9D0464996170c6B9e75eED71c68B99dDEDf279e8',
// 	'eth': '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022'
// }
// HContract = {
// 	USDC: {
// 	CFToken: '0xfF55c4e42D7C2c4f9fd251f62b3469Fb2783954F',
// 	CFVault: '0x16b0C918B4aEE4Fa87AE20576A369723A3A7F648',
// 	USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
// 	CRV: '0xD533a949740bb3306d119CC777fa900bA034cd52',
// 	USDCDecimal: 1e6,
// 	CRVDecimal: 1e18,
// 	Length: 2,
// 	Name: '稳定币去中心化收益基金',
// 	Introduce:
// 		'基于Curve的多个稳定币池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。'
// 	},
// 	ETH: {
// 		CFToken: '0xBAe7EC1BAaAe7d5801ad41691A2175Aa11bcba19',
// 		CFVault: '0xe39fd820B58f83205Db1D9225f28105971c3D309',
// 		Decimal: 1e18,
// 		Name: 'ETH去中心化收益基金',
// 		Introduce:
// 			'基于Curve的多个ETH池进行投资，每日收到的CRV奖励将转换成相应资产后继续投入。'
// 	}
// }

export {
  Network,
  Contract,
  HContract,
  NContract,
  HNContract,
  PContract,
  HNMarkets,
  API_URL,
  API_V3_URL,
  OPEN_URL,
  Wallets,
  DappId,
  TTIMER,
  HMarkets,
  LMarkets,
  PMarkets,
  NMarkets,
  LPoolContract,
  HPoolContract,
  InfuraURI
};
