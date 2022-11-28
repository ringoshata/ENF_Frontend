// import { BigNumber } from 'bignumber.js'

const copys = (thit, metaMaskAddress) => {
  const spanText = metaMaskAddress;
  const oInput = document.createElement("input");
  oInput.value = spanText;
  document.body.appendChild(oInput);
  oInput.select(); // 选择对象
  document.execCommand("Copy"); // 执行浏览器复制命令
  oInput.className = "oInput";
  oInput.style.display = "none";
  document.body.removeChild(oInput);
  thit.$message({
    message: "Copy success!",
    type: "success",
    offset: 100,
  });
};

const ellipsis = (value, one = 0, two = 6, three = 38, four = 42) => {
  if (!value) return "";
  if (value.length > 10) {
    return value.slice(one, two) + "..." + value.slice(three, four);
  }
  return value;
};
const numberWithCommas = (x) => {
  const values = x.toString().split(".");
  return (
    values[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (values.length == 2 ? "." + values[1] : "")
  );
};
const dividedBy = (balance, num) => {
  if (!Number(balance)) return 0;
  return new BigNumber(balance).dividedBy(num).toString(10);
};
const setConfirmValue = (balance, num) => {
  if (!Number(balance)) return 0;
  return new BigNumber(balance).multipliedBy(num).toFixed(0, 1);
};
const multipliedByFixed = (balance, fee, del) => {
  if (!Number(balance)) return 0;
  return new BigNumber(balance).multipliedBy(fee).toFixed(del, 1);
};
const setAssetsValue = (balance, num) => {
  if (!Number(balance)) return 0;
  return new BigNumber(num).multipliedBy(balance).dividedBy(100).toString(10);
};
const setWithdrawValue = (balance, lp_token, user_assets) => {
  if (!Number(balance)) return 0;
  if (!Number(user_assets)) return 0;
  return new BigNumber(balance)
    .dividedBy(user_assets)
    .multipliedBy(lp_token)
    .toFixed(0, 1);
};
//小于等于
const isLessThanOrEqualTo = (num1, num2) => {
  return new BigNumber(num1).lte(num2);
};
//小于lt
const isLt = (num1, num2) => {
  return new BigNumber(num1).lt(num2);
};
//小于钱包余额-0.1
const minusLet = (num1, num2) => {
  return new BigNumber(num1).lte(new BigNumber(num2).minus(0.1));
};
//ETH-0.1
const minus = (num2) => {
  if (new BigNumber(num2).minus(0.1).lt(0)) {
    return 0;
  } else {
    return new BigNumber(num2).minus(0.1);
  }
};
//生成随机数
const random = (lower, upper) => {
  return Math.floor(Math.random() * (upper - lower)) + lower;
};

const calcAPY = (his, list, all) => {
  console.log("His: ", his, list);
  his = his.sort((a, b) => a.lastRecorded - b.lastRecorded);
  const oneYear = 365 * 24 * 3600 * 1000;
  let apys = avgByDate(his);

  if (!all && apys.length < 105) {
    apys = [...list.slice(0, 105 - apys.length), ...apys];
  } else if (all) {
    apys = [...list, ...apys];
    apys = avgByDate(apys, true);
  }

  let avgApys = [];
  for (let i = 0; i < apys.length; i++) {
    const start = i >= 30 ? i - 30 : 0;
    const end = i;
    const subArr = apys.slice(start, end);
    let avg = 0;
    for (let j = 0; j < subArr.length; j++) {
      avg += subArr[j].profit;
    }
    avg /= subArr.length;
    console.log("Sub: ", avg, subArr);
    avgApys.push({ profit: avg, date: apys[i].date });
  }

  // const apys = his.map((rec) => ({
  //   profit: rec.apy,
  //   date: rec.lastRecorded / 1000,
  // }));

  // const len = apys.length > 90 && !all ? 90 : apys.length;
  // for (let i = 0; i < len; i++) {
  //   avg += Number(apys[i].profit);
  // }

  // avg /= len;

  avgApys = avgApys.sort((a, b) => a.date - b.date);
  console.log("AVG APYS: ", avgApys);
  let avg = avgApys[avgApys.length - 1].profit;
  console.log("AVG: ", avg);
  return {
    apys: all ? avgApys : avgApys.length > 15 ? avgApys.slice(15) : avgApys,
    avg,
  };
};

const avgByDate = (his, all) => {
  const apys = [];
  let sameDate = 1;
  for (let i = 0; i < his.length; i++) {
    const prevItem = apys[apys.length - 1];
    if (!prevItem)
      apys.push({
        profit: all ? his[i].profit : his[i].apy,
        date: all ? his[i].date : his[i].lastRecorded / 1000,
      });
    else {
      const prevMonth = all
        ? new Date(prevItem.date * 1000).getMonth()
        : new Date(prevItem.date * 1000).getMonth();
      const prevDate = all
        ? new Date(prevItem.date * 1000).getDate()
        : new Date(prevItem.date * 1000).getDate();
      const month = all
        ? new Date(his[i].date * 1000).getMonth()
        : new Date(his[i].lastRecorded).getMonth();
      const date = all
        ? new Date(his[i].date * 1000).getDate()
        : new Date(his[i].lastRecorded).getDate();

      if (prevMonth === month && prevDate === date) {
        let apy = 0;
        if (all) {
          if (prevItem.profit > his[i].profit) apy = prevItem.profit;
          else apy = his[i].profit;
        } else {
          if (prevItem.profit > his[i].apy) apy = prevItem.profit;
          else apy = his[i].apy;
        }
        // const apy = all
        //   ? (prevItem.profit * sameDate + his[i].profit) / (sameDate + 1)
        //   : (prevItem.profit * sameDate + his[i].apy) / (sameDate + 1);
        // sameDate++;
        apys[apys.length - 1].profit = apy;
      } else {
        apys.push({
          profit: all ? his[i].profit : his[i].apy,
          date: all ? his[i].date : Math.ceil(his[i].lastRecorded / 1000),
        });
      }
    }
  }
  return apys;
};

export {
  dividedBy,
  setConfirmValue,
  copys,
  ellipsis,
  setAssetsValue,
  setWithdrawValue,
  isLessThanOrEqualTo,
  random,
  multipliedByFixed,
  isLt,
  minusLet,
  numberWithCommas,
  minus,
  calcAPY,
};
