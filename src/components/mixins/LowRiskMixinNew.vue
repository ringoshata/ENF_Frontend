<script>
import {
  getIERCBalanceOf,
  getETHBalance,
  getNAllowance,
  setNDeposit,
  setDepositETH,
  getNWithdraw,
  setNApprove,
  calc_withdraw_one_coin,
  getNTotalAsset,
  getNAsset,
  getExchangeRateFromLContract,
  formatUnit,
  getWithdrawable,
  getNWithdrawFee,
} from "@/common/web3";

import { getAsset, getProfit, fetchTxs, fetchTotalHis } from "@/common/api";
import {
  dividedBy,
  setConfirmValue,
  setWithdrawValue,
  isLessThanOrEqualTo,
  setAssetsValue,
  random,
  multipliedByFixed,
  isLt,
  minusLet,
  minus,
  calcAPY,
} from "@/utils";
import {
  Contract,
  NContract,
  TTIMER,
  LMarkets,
  NMarkets,
} from "../../config.js";
import { mapState } from "vuex";
import BigNumber from "bignumber.js";
const LowExchangeRate = {
  USDC: 0.99,
  WBTC: 0.98,
  ETH: 0.97,
};
export default {
  computed: {
    ...mapState(["MetaMaskAddress", "Pendings"]),
  },
  props: {
    goData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      list: [],
      marks: {
        0: "0",
        25: "25%",
        50: "50%",
        75: "75%",
        100: "100%",
      },
      textList: {
        USDC: "Invest in stable-coin pools on multiple Defi protocols, rewards received will be converted into USDC for further investment automatically.",
        WBTC: "Invest in BTC pools on multiple Defi protocols, rewards received will be converted into USDC for further investment automatically.",
        ETH: "Invest in ETH pools on multiple Defi protocols, rewards received will be converted into USDC for further investment automatically.",
      },
      loading: null,
      itemData: null,
      Max: 0,
      totalOf: 0,
      withdrawInput: 0,
      withdrawVal: 0,
      confirmInput: 0,
      confirmVal: 0,
      dialogVisible: false,
      title: "",
      diaWidth: "40%",
      dialogName: "",
      echartsData: [],
      tableData: [],
      isApprove: true,
      ratio: "0%",
      codeurl: "",
      calcNum: null,
      isCalc: false,
      slippage: "0",
      totalassets: 0,
    };
  },
  watch: {
    Pendings(cur, old) {
      if (old.length > cur.length) {
        if (!this.itemData) return;
        this.getTotalOf(this.itemData.code);
      }
    },
    MetaMaskAddress(cur, old) {
      this.getAssetList();
    },
    withdrawInput(newValue, oldValue) {
      this.fetchExchangeRate(this.itemData.code, newValue);
    },
  },
  mounted() {
    this.getAssetList();
  },
  methods: {
    closeisisCalc() {
      this.calcNum = null;
      this.isCalc = false;
    },
    getTimer() {
      NMarkets.forEach((item) => {
        const timer = random(TTIMER[0], TTIMER[1]);
        this[item + "timer"] = setInterval(() => {
          this.getAssets(item.toUpperCase());
        }, timer);
      });
    },
    async getAssets(codename) {
      const total = await getNTotalAsset(codename);
      // const usdcData = await getAsset(this.MetaMaskAddress, codename);
      // this.list.forEach((item, idx) => {
      //   if (item.code === usdcData.data.code) {
      //     if (
      //       item.totalassets !== usdcData.data.totalassets ||
      //       item.user_assets !== usdcData.data.user_assets
      //     ) {
      //       let showContent = false;
      //       if (this.itemData && this.itemData.code === usdcData.data.code) {
      //         showContent = this.itemData.showContent
      //           ? this.itemData.showContent
      //           : false;
      //         this.itemData = { ...usdcData.data, showContent: showContent };
      //       }
      //       this.$set(this.list, idx, {
      //         ...usdcData.data,
      //         showContent: showContent,
      //       });
      //     }
      //   }
      // });
    },

    async getAssetInfo(account, item) {
      const decimal = NContract[item.toUpperCase()].Decimal;

      // Get Total
      const total = await getNTotalAsset(item.toUpperCase());

      // Get User individual
      const userAssets = await getNAsset(item.toUpperCase(), account);

      let userHistory = [];
      let userProfit = 0;

      if (account) {
        userHistory = await fetchTxs(
          NContract[item.toUpperCase()].asset,
          account
        );

        let totalDeposit = 0;
        userHistory.userAssets.reverse().forEach((item) => {
          if (item.tradeType == 0) totalDeposit += Number(item.amount);
          else {
            totalDeposit -= Number(item.amount);
            if (totalDeposit < 0) totalDeposit = 0;
          }
        });

        userProfit =
          totalDeposit < userAssets ? userAssets / decimal - totalDeposit : 0;
      }

      const totalHis = await fetchTotalHis(
        NContract[item.toUpperCase()].vault,
        30 * 24 * 3600
      );

      const { avg } = calcAPY(totalHis.totalRec);

      const ratio = await getNWithdrawFee(item.toUpperCase());

      return {
        total: total / decimal,
        user_assets: userAssets / decimal,
        user_profit: userProfit,
        sevendayProfit: avg,
        code: item.toUpperCase(),
        ratio: ratio / 10000,
        decimal: NContract[item.toUpperCase()].Decimal,
      };
    },

    async getAssetList() {
      // const total = await getNTotalAsset("USDC");

      // const asset = await getNAsset("USDC", this.MetaMaskAddress)

      this.isLoading();
      Promise.all(
        NMarkets.map(async (item, idx) => {
          return this.getAssetInfo(this.MetaMaskAddress, item);
        })
      )
        .then(([...NMarkets]) => {
          this.list = NMarkets.map((item) => {
            return {
              ...item,
              showContent: false,
            };
          });
          if (this.$route.params.type && this.$route.params.type === "low") {
            const data = this.list.find(
              (item) => item.code === this.$route.params.code
            );
            this.changeContent(data);
          }
          NMarkets.forEach((item) => {
            clearInterval(this[item + "timer"]);
            this[item + "timer"] = null;
          });
          this.getTimer();
          this.downLoading();
        })
        .catch((err) => {
          this.downLoading();
        });
    },
    async approve() {
      if (!this.MetaMaskAddress) return this.Warning("Please link wallet");
      this.isLoading();
      try {
        const resApprove = await setNApprove(
          new BigNumber(1e32).toString(10),
          this.MetaMaskAddress,
          this.itemData.code
        );
        if (resApprove.status) {
          this.isApprove = false;
          this.Success("Successfully authorized.");
          this.downLoading();
        }
      } catch (error) {
        this.downLoading();
      }
    },
    async confirm(item) {
      if (!this.MetaMaskAddress) return this.Warning("Please link wallet");
      if (Number(this.confirmInput) === 0) return this.Warning("Invalid Value");
      const less = isLessThanOrEqualTo(this.confirmInput, this.totalOf);
      if (!less) return this.Warning("Invalid Value");
      if (item.code === "ETH") {
        const minNum = isLt(this.confirmInput, 0.01);
        if (minNum) return this.Warning("Minimum deposit amount 0.01 ETH.");
        const maxNum = minusLet(this.confirmInput, this.totalOf);
        if (!maxNum)
          return this.Warning(
            "The amount of asset you want to deposit exceeds the safe max value, which may lead to failure to pay gas fee.",
            "Invalid value"
          );
      }

      const decimal = NContract[item.code].Decimal;
      const bigInput = setConfirmValue(this.confirmInput, decimal);
      const params =
        this.itemData.code === "ETH"
          ? await setDepositETH(
              bigInput,
              this.MetaMaskAddress,
              this.itemData.code,
              "low"
            )
          : await setNDeposit(
              bigInput,
              this.MetaMaskAddress,
              this.itemData.code
            );
      this.sendTransaction(params);
    },
    async fetchExchangeRate(code, value) {
      if (value < 1e-6) {
        this.slippage = "0";
        return;
      }
      const exchangeRate = await getExchangeRateFromLContract(code, value);
      const standardExchangeRate = await getExchangeRateFromLContract(code, 1);
      this.slippage = Number(
        ((standardExchangeRate - exchangeRate) * 100).toFixed(2)
      );
    },
    async withdrawItem(item) {
      if (!this.MetaMaskAddress) return this.Warning("Please link wallet");
      if (Number(this.withdrawInput) === 0)
        return this.Warning("Invalid Value");
      const less = isLessThanOrEqualTo(this.withdrawInput, item.user_assets);
      if (!less) return this.Warning("Invalid Value");
      const exchangeRate = await getExchangeRateFromLContract(
        item.code,
        this.withdrawInput
      );
      if (exchangeRate > LowExchangeRate[item.code]) {
        this.withdraw(item);
      } else {
        this.$confirm(
          "The market is fluctuating now. Withdraw may experience big slippage results in a big loss of principle. Are you sure to continue?",
          "Warning",
          {
            confirmButtonText: "Continue",
            cancelButtonText: "Cancel",
            type: "warning",
          }
        )
          .then(() => {
            this.$message({
              type: "success",
              message: "Action completed",
            });
            this.withdraw(item);
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "Action canceled",
            });
          });
      }
    },
    async withdraw(item, type = 0) {
      const maxWithdraw = this.withdrawInput === item.user_assets;
      const bigInput =
        maxWithdraw === true
          ? item.lp_token
          : setWithdrawValue(
              this.withdrawInput,
              item.lp_token,
              item.user_assets
            );
      if (item.code === "USDC" && type === 0) {
        const amount = new BigNumber(this.withdrawInput).multipliedBy(
          new BigNumber(item.decimal).toFixed(0)
        );
        // .multipliedBy(this.itemData.lpTokenBalance)
        // .dividedBy(this.itemData.totalSupply)
        // .toFixed(0);

        const a = await getWithdrawable(
          item.code,
          this.MetaMaskAddress,
          amount
        );
        this.calcNum = new BigNumber(amount)
          .minus(a)
          .dividedBy(amount)
          .toString();
        if (new BigNumber(this.calcNum).gt(0.02)) {
          this.isCalc = true;
        } else {
          const params = await getNWithdraw(
            amount,
            this.MetaMaskAddress,
            item.code
          );
          this.sendTransaction(params);
          this.calcNum = null;
          this.isCalc = false;
        }
      } else {
        const params = await getNWithdraw(
          bigInput,
          this.MetaMaskAddress,
          item.code
        );
        this.sendTransaction(params);
        this.calcNum = null;
        this.isCalc = false;
      }
    },
    inputConfirm() {
      this.confirmVal = 0;
    },
    setConfirmVal(item) {
      const num =
        this.itemData.code === "ETH" ? minus(this.totalOf) : this.totalOf;
      this.confirmInput = setAssetsValue(item, num);
    },
    setWithdrawVal(item) {
      this.withdrawInput =
        item === 100
          ? this.itemData.user_assets
          : setAssetsValue(item, this.itemData.user_assets);
      this.inputWithdraw("set");
    },
    inputWithdraw(type = null) {
      if (type !== "set") {
        this.withdrawVal = 0;
      }
      // if (!this.withdrawInput) {
      //   this.ratio = Number(this.itemData.ratio) * 100 + "%";
      //   return;
      // }
      // if (Number(this.withdrawInput) === 0) {
      //   this.ratio = Number(this.itemData.ratio) * 100 + "%";
      //   return;
      // }
      // this.ratio = multipliedByFixed(
      //   this.withdrawInput,
      //   this.itemData.ratio,
      //   Contract[this.itemData.code].Length
      // );
    },
    setMax(type, val) {
      if (type === 1) {
        this.confirmInput = this.itemData.code === "ETH" ? minus(val) : val;
      } else {
        this.withdrawInput = val.user_assets;
        this.inputWithdraw();
      }
    },
    isLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
    },
    downLoading() {
      if (this.loading) {
        this.loading.close();
      }
      this.loading = null;
    },
    async changeContent(val) {
      this.isLoading();
      this.withdrawInput = 0;
      this.withdrawVal = 0;
      this.confirmInput = 0;
      this.confirmVal = 0;
      this.isApprove = true;
      if (val.code !== "ETH" && !val.showContent && this.MetaMaskAddress) {
        const allowance = await getNAllowance(this.MetaMaskAddress, val.code);
        const myAllowance = dividedBy(allowance, Contract[val.code].Decimal);
        const less = isLessThanOrEqualTo(myAllowance, 0);
        this.isApprove = less;
      }
      this.list.map((item) => {
        if (val.code === item.code) {
          item.showContent = !item.showContent;
          if (item.showContent) {
            this.itemData = { ...val };
            this.ratio = Number(val.ratio) * 100 + "%";
            this.downLoading();
            this.getTotalOf(val.code);
          } else {
            this.downLoading();
            this.itemData = null;
          }
        } else {
          item.showContent = false;
        }
      });
    },

    async getTotalOf(code) {
      if (!this.MetaMaskAddress) {
        this.totalOf = 0;
        return this.downLoading();
      }
      const bcf =
        code === "ETH"
          ? await getETHBalance(this.MetaMaskAddress)
          : await getIERCBalanceOf(this.MetaMaskAddress, code);
      const number = Contract[code].Decimal;
      this.totalOf = dividedBy(bcf, number);
    },
    closeMain(val) {
      this.title = "";
      this.dialogVisible = val;
    },

    async selectLine() {
      this.codeurl = this.itemData.code.toLowerCase();
      // const list = await getProfit(this.codeurl);

      const totalHis = await fetchTotalHis(
        NContract[this.itemData.code.toUpperCase()].vault,
        30 * 24 * 3600
      );

      const apys = totalHis.totalRec.map((rec) => ({
        profit: rec.apy,
        date: rec.lastRecorded / 1000,
      }));

      this.echartsData = apys.reverse();
      // this.echartsData = list.dataList;
      this.title = "7 Days APY";
      this.dialogName = "EchartsLine";
      this.diaWidth = "80%";
      this.dialogVisible = true;
    },
    async selectTable() {
      this.codeurl = `n${this.itemData.code.toLowerCase()}`;
      this.title = "History";
      this.dialogName = "CffTableNew";
      this.diaWidth = "80%";
      this.dialogVisible = true;
    },
  },

  destroyed() {
    NMarkets.forEach((item) => {
      clearInterval(this[item + "timer"]);
      this[item + "timer"] = null;
    });
  },
};
</script>
