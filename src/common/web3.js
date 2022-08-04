import Vue from 'vue'
import { Contract, HContract, LPoolContract, HPoolContract } from '../config.js'
import BigNumber from "bignumber.js"

const CFVault_abi = require('./CFVault_abi.json')
const DiCFVault_abi = require('./DiCFVault_abi.json')
const IERC20_abi = require('./IERC20_abi.json')
const ERC20DepositApprover_abi = require('./ERC20DepositApprover_abi.json')
//高风险
const EFCRVVault_abi = require('./EFCRVVault_abi.json')
const ETHEFCRVVaule_abi = require('./ETHEFCRVVaule_abi.json')
const Curve_abi = require('./Curve.json')
const VirtualPrice_abi = require('./VirtualPrice_abi.json')
const Exchange_Rate_abi = require('./Exchange_Rate_abi.json')

// 动态获取web3实例对象
const getWeb3 = (abi, accounts) => {
	return new Vue.prototype.$web3.eth.Contract(abi, accounts)
}
const getGasPrice = () => {
	return Vue.prototype.$web3.eth.getGasPrice()
}

//获取ETH
const getETHBalance = (metaMaskAddress) => {
	return Vue.prototype.$web3.eth.getBalance(metaMaskAddress)
}

// 获取CFVault实例对象
const getCFVault = (CFVault) => {
	return getWeb3(CFVault_abi, CFVault)
}

//获取IERC20地址
const getIERC = (CFVault) => {
	return getCFVault(CFVault).methods.target_token().call()
}
//获取IERC20BalanceOf
const getIERCBalanceOf = async (accounts, code) => {
	let ierc = await getIERC(Contract[code].CFVault)
	return getWeb3(IERC20_abi, ierc).methods.balanceOf(accounts).call()
}

// 获取交易状态
const getTransactionReceipt = (hash) => {
	return Vue.prototype.$web3.eth.getTransactionReceipt(hash)
}
// 获取Pending
const getTransaction = (hash) => {
	return Vue.prototype.$web3.eth.getTransaction(hash)
}

//查询授权额度
const getAllowance = async (accounts, code) => {
	if (!accounts) return 0
	const ierc = await getIERC(Contract[code].CFVault)
	return getWeb3(IERC20_abi, ierc)
		.methods.allowance(accounts, Contract[code].ERC20DepositApprover)
		.call()
}
//授权
const setApprove = async (number, accounts, code) => {
	const ierc = await getIERC(Contract[code].CFVault)
	return getWeb3(IERC20_abi, ierc)
		.methods.approve(Contract[code].ERC20DepositApprover, number)
		.send({
			from: accounts
		})
}

// const updatePeriodStatu = async (accounts, name) => {
// 	const data = await getWeb3(HGateKeeper_abi, HGateKeeper[name])
// 		.methods.updatePeriodStatus()
// 		.encodeABI()
// 	return {
// 		from: accounts,
// 		to: HGateKeeper[name],
// 		value: 0,
// 		data: data
// 	}
// }

//查询授权额度
const getHAllowance = async (accounts, code, type) => {
	if (!accounts) return 0
	return getWeb3(IERC20_abi, HContract[code][type])
		.methods.allowance(accounts, HContract[code].CFVault)
		.call()
}
//授权
const setHApprove = async (number, accounts, code, type) => {
	return getWeb3(IERC20_abi, HContract[code][type])
		.methods.approve(HContract[code].CFVault, number)
		.send({
			from: accounts
		})
}

//获取IERC20BalanceOf
const getHIERCBalanceOf = async (accounts, code, type) => {
	return getWeb3(IERC20_abi, HContract[code][type])
		.methods.balanceOf(accounts)
		.call()
}

//存ETH

const setDepositETH = async (number, accounts, code, type) => {
	let params = null
	let abi = null
	if (type === 'low') {
		abi = Contract[code].CFVault
		params = await getWeb3(DiCFVault_abi, Contract[code].CFVault)
			.methods.deposit()
			.encodeABI()
	} else {
		abi = HContract[code].CFVault
		params = await getWeb3(CFVault_abi, HContract[code].CFVault)
			.methods.deposit(number)
			.encodeABI()
	}
	return {
		from: accounts,
		to: abi,
		value: number,
		data: params
	}
}

//存低风险
const setDeposit = async (number, accounts, code) => {
	const params = await getWeb3(
		ERC20DepositApprover_abi,
		Contract[code].ERC20DepositApprover
	)
		.methods.deposit(
			Contract[code][code],
			number,
			Contract[code].CFVault,
			Contract[code].CFToken
		)
		.encodeABI()

	return {
		from: accounts,
		to: Contract[code].ERC20DepositApprover,
		value: 0,
		data: params
	}
}

//存高风险
const setHDeposit = async (number, accounts, code, type) => {
	const params =
		type === 'USDC'
			? await getWeb3(EFCRVVault_abi, HContract[code].CFVault)
					.methods.depositStable(number)
					.encodeABI()
			: await getWeb3(EFCRVVault_abi, HContract[code].CFVault)
					.methods.deposit(number)
					.encodeABI()
	return {
		from: accounts,
		to: HContract[code].CFVault,
		value: 0,
		data: params
	}
}

//取低风险
const getWithdraw = async (number, accounts, code) => {
	const params = await getCFVault(Contract[code].CFVault)
		.methods.withdraw(number)
		.encodeABI()
	return {
		from: accounts,
		to: Contract[code].CFVault,
		value: 0,
		data: params
	}
}
//取高风险
const getHWithdraw = async (number, accounts, code, type) => {
	let params = null
	console.log('number: ', number);
	if (code === 'ETH') {
		params = await getWeb3(ETHEFCRVVaule_abi, HContract[code].CFVault)
			.methods.withdraw(number)
			.encodeABI()
	} else {
		const useStable = type === 'USDC' ? true : false
		params = await getWeb3(EFCRVVault_abi, HContract[code].CFVault)
			.methods.withdraw(number, useStable)
			.encodeABI()
	}
	return {
		from: accounts,
		to: HContract[code].CFVault,
		value: 0,
		data: params
	}
}

const calc_withdraw_one_coin = (amount) => {
	return getWeb3(Curve_abi, '0xA79828DF1850E8a3A3064576f380D90aECDD3359')
		.methods.calc_withdraw_one_coin(
			'0x43b4fdfd4ff969587185cdb6f0bd875c5fc83f8c',
			amount,
			'2'
		)
		.call()
}

const getVirtualPriceFromLContract = async (code) => {
	return getWeb3(VirtualPrice_abi,LPoolContract[code])
		.methods.get_virtual_price()
		.call()
}

const getVirtualPriceFromHContract = async (code) => {
	return getWeb3(VirtualPrice_abi,HPoolContract[code])
		.methods.get_virtual_price()
		.call()
}

const getExchangeRateFromLContract = async (code, amount) => {
	let exRate = 0
	if(code==='USDC') {
		const amountInString = new BigNumber(amount).times(1e18).toString(10)
		exRate = await getWeb3(Exchange_Rate_abi, '0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c')
			.methods.get_dy_underlying('0', '2', amountInString).call()
		return new BigNumber(exRate).dividedBy(new BigNumber(amount)).dividedBy(new BigNumber(1e6)).toNumber()
	} else if(code === 'WBTC') {
		const amountInString = new BigNumber(amount).times(1e8).toString(10)
		exRate = await getWeb3(Exchange_Rate_abi, '0x93054188d876f558f4a66B2EF1d97d16eDf0895B')
			.methods.get_dy_underlying('0','1',amountInString).call()
		return new BigNumber(exRate).dividedBy(new BigNumber(amount)).dividedBy(new BigNumber(1e8)).toNumber()
	} else if(code === 'ETH') {
		const amountInString = new BigNumber(amount).times(1e18).toString(10)
		exRate = await getWeb3(Exchange_Rate_abi, '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022')
			.methods.get_dy('1', '0', amountInString).call()
		return new BigNumber(exRate).dividedBy(new BigNumber(amount)).dividedBy(new BigNumber(1e18)).toNumber()
	}
	return 0
}
const getExchangeRateFromHContract = async (code, amount) => {
	let exRate = 0
	if(code==='USDC') {
		const amountInString = new BigNumber(amount).times(1e18).toString(10)
		exRate = await getWeb3(Exchange_Rate_abi, '0x9D0464996170c6B9e75eED71c68B99dDEDf279e8')
			.methods.get_dy('1', '0', amountInString).call()
		return new BigNumber(exRate).dividedBy(new BigNumber(amount)).dividedBy(new BigNumber(1e18)).toNumber()
	} else if(code === 'ETH') {
		const amountInString = new BigNumber(amount).times(1e18).toString(10)
		exRate = await getWeb3(Exchange_Rate_abi, '0xDC24316b9AE028F1497c275EB9192a3Ea0f67022')
			.methods.get_dy('1', '0', amountInString).call()
		return new BigNumber(exRate).dividedBy(new BigNumber(amount)).dividedBy(new BigNumber(1e18)).toNumber()
	}
	return 0
}

export {
	getWeb3,
	getGasPrice,
	getIERCBalanceOf,
	getETHBalance,
	getTransactionReceipt,
	getTransaction,
	getAllowance,
	setApprove,
	setDeposit,
	setDepositETH,
	getWithdraw,
	getHAllowance,
	setHApprove,
	getHIERCBalanceOf,
	setHDeposit,
	getHWithdraw,
	calc_withdraw_one_coin,
	getVirtualPriceFromLContract,
	getVirtualPriceFromHContract,
	getExchangeRateFromLContract,
	getExchangeRateFromHContract
}
