import axios from "axios";
import { pools } from "./convexpools";
const ETHERSCAN_KEY = "T6XP5DY6UUVHJHVR51X1MPCBMCQNERPWI9";

const fetch = async (url) => await axios.get(url);

/// ------ Balances ------- ///

async function convexBalance(poolName, address) {
  var pool = pools.find((pool) => pool.name == poolName);

  var bal = await convexBASE(address, pool);

  return bal;
}

async function convexStakedCVX(address) {
  var stakeContract = "0xCF50b810E57Ac33B91dCF525C6ddd9881B139332";
  var balance = balanceOf(address, stakeContract, 18);
  if (isNaN(balance)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexStakedCVX(address);
  }
  return balance;
}

async function convexLockedCVX(address) {
  var lockContract = "0xD18140b4B819b895A3dba5442F959fA44994AF50";
  var balance = lockedBalanceOf(address, lockContract, 18);
  if (isNaN(balance)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexLockedCVX(address);
  }
  return balance;
}

async function convexStakedCvxCRV(address) {
  var stakeContract = "0x3Fe65692bfCD0e6CF84cB1E7d24108E434A7587e";
  var balance = balanceOf(address, stakeContract, 18);
  if (isNaN(balance)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexStakedCvxCRV(address);
  }
  return balance;
}

async function convexLpCVXETH(address) {
  var balance = masterChefBalance(address, 1);
  if (isNaN(balance)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexLpCVXETH(address);
  }
  return balance;
}

async function convexLpCvxCRVCRV(address) {
  var balance = masterChefBalance(address, 2);
  if (isNaN(balance)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexLpCvxCRVCRV(address);
  }
  return balance;
}

//// ----------- APRs ----------- ///

export async function convexAPR(poolName) {
  return await convexAPRWithPrice(poolName, -1, -1);
}

async function convexAPRWithPrice(poolName, crvPrice, cvxPrice) {
  var pool = pools.find((pool) => pool.name == poolName);
  var curveSwap = pool.swap;
  var stakeContract = pool.crvRewards;

  console.log({ pool });

  //get reward rate
  var rate = await rewardRate(stakeContract);

  console.log({ rate });

  //get virtual price
  var virtualPrice = 1;
  if (pool.isV2 == undefined || pool.isV2 == false) {
    virtualPrice = await curveLpValue(1, curveSwap);
  } else {
    virtualPrice = await curveV2LpValue(pool, pool.currency);
  }

  //get supply
  var supply = await supplyOf(stakeContract);

  //virtual supply
  supply = supply * virtualPrice;

  //crv per underlying per second
  var crvPerUnderlying = rate / supply;

  //crv per year
  var crvPerYear = crvPerUnderlying * 86400 * 365;
  var cvxPerYear = await getCVXMintAmount(crvPerYear);

  if (cvxPrice <= 0) cvxPrice = await getPrice(cvxAddress, pool.currency);

  if (crvPrice <= 0) crvPrice = await getPrice(crvAddress, pool.currency);
  console.log({ cvx });

  let crvAPR = crvPerYear * crvPrice;
  let cvxAPR = cvxPerYear * cvxPrice;

  let apr = crvAPR + cvxAPR;
  console.log("apr of crv/cvx: ", { crvAPR, cvxAPR, apr });
  if (pool.extras != undefined && pool.extras.length > 0) {
    for (var i in pool.extras) {
      var ex = pool.extras[i];
      var exrate = await rewardRate(ex.contract);
      var perUnderlying = exrate / supply;
      var perYear = perUnderlying * 86400 * 365;
      var price = await getPrice(ex.token, pool.currency);
      console.log(
        "extra per year: " +
          perYear +
          "  price: " +
          price +
          " apr: " +
          perYear * price
      );
      apr += perYear * price;
    }
  }

  if (isNaN(apr)) {
    // Utilities.sleep(randomInt(500, 1000));
    return await convexAPRWithPrice(poolName, crvPrice, cvxPrice);
  }

  return apr;
}

//locked CVX APR
async function convexLockedCVXAPR() {
  var stakeContract = "0xD18140b4B819b895A3dba5442F959fA44994AF50";
  var rate = rewardRateOf(stakeContract, cvxCrvAddress);
  var supply = boostedSupply(stakeContract);
  var cvxPrice = getPrice(cvxAddress, "USD");
  supply *= cvxPrice;
  rate /= supply;

  var crvPerYear = rate * 86400 * 365;
  var crvPrice = getPrice(crvAddress, "USD");
  var apr = crvPerYear * crvPrice;

  if (isNaN(apr)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexLockedCVXAPR();
  }
  return apr;
}

//staked CVX APR
async function convexStakedCVXAPR() {
  var stakeContract = "0xCF50b810E57Ac33B91dCF525C6ddd9881B139332";
  var rate = rewardRate(stakeContract);
  var supply = supplyOf(stakeContract);
  var cvxPrice = getPrice(cvxAddress, "USD");
  supply *= cvxPrice;
  rate /= supply;

  var crvPerYear = rate * 86400 * 365;
  var crvPrice = getPrice(crvAddress, "USD");
  var apr = crvPerYear * crvPrice;

  if (isNaN(apr)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexStakedCVXAPR();
  }
  return apr;
}

//staked cvxCRV apr
async function convexStakedCvxCRVAPR() {
  var stakeContract = "0x3Fe65692bfCD0e6CF84cB1E7d24108E434A7587e";
  var theepoolstakeContract = "0x7091dbb7fcbA54569eF1387Ac89Eb2a5C9F6d2EA";
  var curveSwap = "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7";

  var rate = rewardRate(stakeContract);
  var threerate = rewardRate(theepoolstakeContract);
  var supply = supplyOf(stakeContract);

  var virtualPrice = curveLpValue(1, curveSwap);
  var crvPrice = getPrice(crvAddress, "USD");
  var cvxPrice = getPrice(cvxAddress, "USD");

  supply *= crvPrice;
  rate /= supply;
  threerate /= supply;

  var crvPerYear = rate * 86400 * 365;
  var cvxPerYear = getCVXMintAmount(crvPerYear);
  var threepoolPerYear = threerate * 86400 * 365;

  var apr =
    crvPerYear * crvPrice +
    cvxPerYear * cvxPrice +
    threepoolPerYear * virtualPrice;

  if (isNaN(apr)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexStakedCvxCRVAPR();
  }
  return apr;
}

async function convexLpCVXETHAPR() {
  var stakeContract = "0x9e01aaC4b3e8781a85b21d9d9F848e72Af77B362";
  var rate = rewardRate(stakeContract);
  var supply = supplyOf(stakeContract);
  var slpBalance = balanceOf(
    "0x05767d9EF41dC40689678fFca0608878fb3dE906",
    cvxAddress,
    18
  );
  var slpSupply = supplyOf("0x05767d9EF41dC40689678fFca0608878fb3dE906");
  var slpBToS = (slpBalance * 2) / slpSupply; //approx value of slp in cvx terms by multiplying cvx balance by 2

  supply *= slpBToS;
  var cvxPrice = getPrice(cvxAddress, "USD");

  supply = supply * cvxPrice;
  rate /= supply;

  var cvxPerYear = rate * 86400 * 365;

  var apr = cvxPerYear * cvxPrice;

  var totalAlloc = totalAllocPoint();
  var info = poolInfo(1);
  var alloc = info.result.slice(130);
  alloc = parseInt(alloc, 16);

  var sushiRate = sushiPerBlock() * (alloc / totalAlloc);

  var sushiPrice = getPrice(
    "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
    "USD"
  );

  sushiRate /= supply;
  var sushiPerYear = sushiRate * 6400 * 365;
  var sushiApr = sushiPerYear * sushiPrice;
  //console.log("sushi apr: " +sushiApr);

  apr += sushiApr;

  //TODO: base trade fees

  if (isNaN(apr)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexLpCVXETHAPR();
  }

  console.log("cvx slp apr: " + apr);
  return apr;
}

async function convexLpcvxCRVCRVAPR() {
  var stakeContract = "0x1FD97b5E5a257B0B9b9A42A96BB8870Cbdd1Eb79";
  var rate = rewardRate(stakeContract);
  var supply = supplyOf(stakeContract);
  var slpBalance = balanceOf(
    "0x33F6DDAEa2a8a54062E021873bCaEE006CdF4007",
    cvxCrvAddress,
    18
  );
  var slpSupply = supplyOf("0x33F6DDAEa2a8a54062E021873bCaEE006CdF4007");
  var slpBToS = (slpBalance * 2) / slpSupply; //approx value of slp in cvxcrv terms by multiplying cvxcrv balance by 2

  supply *= slpBToS;
  var cvxcrvPrice = getPrice(cvxCrvAddress, "USD");
  var cvxPrice = getPrice(cvxAddress, "USD");

  supply = supply * cvxcrvPrice;
  rate /= supply;

  var cvxPerYear = rate * 86400 * 365;

  var apr = cvxPerYear * cvxPrice;
  //console.log("cvx apr: " +apr);

  var totalAlloc = totalAllocPoint();
  var info = poolInfo(1);
  var alloc = info.result.slice(130);
  alloc = parseInt(alloc, 16);

  var sushiRate = sushiPerBlock() * (alloc / totalAlloc);

  var sushiPrice = getPrice(
    "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
    "USD"
  );

  sushiRate /= supply;
  var sushiPerYear = sushiRate * 6400 * 365;
  var sushiApr = sushiPerYear * sushiPrice;
  //console.log("sushi apr: " +sushiApr);

  apr += sushiApr;

  //TODO: base trade fees

  if (isNaN(apr)) {
    // Utilities.sleep(randomInt(500, 1000));
    return convexLpcvxCRVCRVAPR();
  }

  console.log("cvxcrv slp apr: " + apr);
  return apr;
}

////--------------- Util  -------------------///

let crvAddress = "0xD533a949740bb3306d119CC777fa900bA034cd52";
let cvxAddress = "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B";
let cvxCrvAddress = "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7";

let cliffSize = 100000; // * 1e18; //new cliff every 100,000 tokens
let cliffCount = 1000; // 1,000 cliffs
let maxSupply = 100000000; // * 1e18; //100 mil max supply

async function getCVXMintAmount(crvEarned) {
  //first get total supply
  var cvxSupply = supplyOf(cvxAddress);
  //get current cliff
  var currentCliff = cvxSupply / cliffSize;
  //if current cliff is under the max
  if (currentCliff < cliffCount) {
    //get remaining cliffs
    var remaining = cliffCount - currentCliff;

    //multiply ratio of remaining cliffs to total cliffs against amount CRV received
    var cvxEarned = (crvEarned * remaining) / cliffCount;

    //double check we have not gone over the max supply
    var amountTillMax = maxSupply - cvxSupply;
    if (cvxEarned > amountTillMax) {
      cvxEarned = amountTillMax;
    }
    return cvxEarned;
  }
  return 0;
}

async function convertRate(rewards, compareTo) {
  var crvRate = getPrice(crvAddress, compareTo);
  var cvxRate = getPrice(cvxAddress, compareTo);

  rewards[0] = rewards[0] * crvRate;
  rewards[1] = rewards[1] * cvxRate;
  return rewards[0] + rewards[1];
}

async function balanceOf(address, contract, decimals) {
  var balanceOfHex = "70a08231";
  address = padHex(address);
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    contract +
    "&data=0x" +
    balanceOfHex +
    address +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("balanceOf", { url });
  const { data } = await fetch(url);
  // var hexValue = data.result;
  // var decimal = Math.pow(10,18);
  var balance = Number(data.result) / Math.pow(10, decimals);

  return balance;
}

async function lockedBalanceOf(address, contract, decimals) {
  var lockedBalanceOfHex = "59355736";
  address = padHex(address);
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    contract +
    "&data=0x" +
    lockedBalanceOfHex +
    address +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("lockedBalanceOf", { url });
  const { data } = await fetch(url);
  // var hexValue = data.result;
  // var decimal = Math.pow(10,18);
  var balance = Number(data.result) / Math.pow(10, decimals);

  return balance;
}

async function earned(address, contract) {
  var earned = "008cc262";
  address = padHex(address);
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    contract +
    "&data=0x" +
    earned +
    address +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("earned", { url });
  const { data } = await fetch(url);
  var hexValue = data.result;
  var decimal = Math.pow(10, 18);
  var supply = parseInt(hexValue, 16) / decimal;
  return supply;
}

async function supplyOf(contract) {
  var totalSupply = "18160ddd";
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    contract +
    "&data=0x" +
    totalSupply +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("supplyOf", { url });
  var { data } = await fetch(url);
  var hexValue = data.result;
  var decimal = Math.pow(10, 18);
  var supply = parseInt(hexValue, 16) / decimal;
  return supply;
}

async function boostedSupply(contract) {
  var boostedSupply = "75aadf61";
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    contract +
    "&data=0x" +
    boostedSupply +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("boostedSupply", { url });
  var { data } = await fetch(url);
  var hexValue = data.result;
  var decimal = Math.pow(10, 18);
  var supply = parseInt(hexValue, 16) / decimal;
  return supply;
}

async function curveLpValue(amount, swapAddress) {
  var virtualPriceHash = "bb7b8b80";

  var swapurl =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    swapAddress +
    "&data=0x" +
    virtualPriceHash +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("curveLpValue", { url });
  var { data } = await fetch(url);
  var hexValue = data.result.slice(0, 66);
  var priceDecimal = Math.pow(10, 18);
  var pricePerShare = parseInt(hexValue, 16) / priceDecimal;

  return amount * pricePerShare;
}

async function curveV2LpValue(pool, currencyType) {
  //get amount of tokens
  var supply = await supplyOf(pool.lptoken);
  //console.log("supply: " +supply);
  var total = 0;
  for (var i = 0; i < pool.coins.length; i++) {
    var bal = await balanceOf(pool.swap, pool.coins[i], pool.coinDecimals[i]);
    //console.log("bal: " +i +" = " +bal);
    var price = await getPrice(pool.coins[i], currencyType);
    //console.log("price: " +i +" = " +price);
    total += bal * price;
  }

  var value = total / supply;
  if (isNaN(value)) {
    // Utilities.sleep(randomInt(500, 1000));
    return curveV2LpValue(pool, currencyType);
  }

  return value;
}

async function convexBASE(address, pool) {
  var curveSwap = pool.swap;
  var depositToken = pool.token;
  var stakeContract = pool.crvRewards;

  var stakedBalance = await balanceOf(address, stakeContract, 18);
  var heldBalance = await balanceOf(address, depositToken, 18);

  if (pool.isV2 != undefined && pool.isV2 == true) {
    return curveV2LpValue(pool, pool.currency) * (stakedBalance + heldBalance);
  }
  return curveLpValue(stakedBalance + heldBalance, curveSwap);
}

async function rewardRate(contract) {
  var rewardRate = "7b0a47ee";
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    contract +
    "&data=0x" +
    rewardRate +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("rewardRate", { url });
  const { data } = await fetch(url);
  var hexValue = data.result;
  var decimal = Math.pow(10, 18);
  var rate = parseInt(hexValue, 16) / decimal;
  return rate;
}

async function rewardRateOf(contract, token) {
  var rewardData = "48e5d9f8";
  var tokenPad = padHex(token);
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    contract +
    "&data=0x" +
    rewardData +
    tokenPad +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("rewardRate", { url });
  const { data } = await fetch(url);
  var result = data.result;
  result = "0x" + result.slice(130, 194);
  var decimal = Math.pow(10, 18);
  var rate = parseInt(result, 16) / decimal;
  // console.log("rate: " +rate);
  return rate;
}

async function totalAllocPoint() {
  var sushiChef = "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d";
  var sig = "17caf6f1";
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    sushiChef +
    "&data=0x" +
    sig +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("totalAllocPoint", { url });
  const { data } = await fetch(url);
  var hexValue = data.result;
  return parseInt(hexValue, 16);
}

async function sushiPerBlock() {
  var sushiChef = "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d";
  var sig = "b0bcf42a";
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    sushiChef +
    "&data=0x" +
    sig +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("sushiPerBlock", { url });
  const { data } = await fetch(url);
  var hexValue = data.result;
  var decimal = Math.pow(10, 18);
  var rate = parseInt(hexValue, 16) / decimal;
  return rate;
}

async function poolInfo(pid) {
  var sushiChef = "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d";
  var sig = "1526fe27"; //poolInfo(uint256)
  pid = padHex("" + pid);
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    sushiChef +
    "&data=0x" +
    sig +
    pid +
    "&tag=latest&apikey=" +
    ETHERSCAN_KEY;
  console.log("poolInfo", { url });
  const { data } = await fetch(url);
  return data;
}

async function masterChefBalance(address, pid) {
  var stakeContract = "0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d";
  address = padHex(address);
  var pidpad = padHex("" + pid);

  var userInfoHex = "93f1a40b"; //uint256,address
  var url =
    "https://api.etherscan.io/api?module=proxy&action=eth_call&to=" +
    stakeContract +
    "&data=0x" +
    userInfoHex +
    pidpad +
    address +
    "&tag=latest" +
    ETHERSCAN_KEY;
  console.log("masterChefBalance", { url });
  const { data } = await fetch(url);
  f;
  var hexValue = data.result;
  var amountHex = hexValue.substring(hexValue.length - 128, 66);
  var priceDecimal = Math.pow(10, 18);
  var lpTokenBalance = parseInt(amountHex, 16) / priceDecimal;
  console.log(lpTokenBalance);

  var balance = 0;
  if (pid == 2) {
    var tSupply = supplyOf("0x33F6DDAEa2a8a54062E021873bCaEE006CdF4007", 18);
    var sharePerc = lpTokenBalance / tSupply;
    console.log("share: " + sharePerc);
    var contractTokenBalance = balanceOf(
      "0x33F6DDAEa2a8a54062E021873bCaEE006CdF4007",
      "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7",
      18
    );
    //var contractTokenBalanceCrv = balanceOf("0x33F6DDAEa2a8a54062E021873bCaEE006CdF4007", crvAddress, 18);
    console.log("cvxcrv on lp: " + contractTokenBalance);
    // console.log("crv on lp: " +contractTokenBalanceCrv);
    balance = contractTokenBalance * sharePerc;
    // var crvBalance = contractTokenBalanceCrv * sharePerc;
  } else if (pid == 1) {
    var tSupply = supplyOf("0x05767d9EF41dC40689678fFca0608878fb3dE906", 18);
    var sharePerc = lpTokenBalance / tSupply;
    console.log("share: " + sharePerc);
    var contractTokenBalance = balanceOf(
      "0x05767d9EF41dC40689678fFca0608878fb3dE906",
      "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B",
      18
    );
    // var contractTokenBalanceWeth = balanceOf("0x05767d9EF41dC40689678fFca0608878fb3dE906", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", 18);
    console.log("cvx on lp: " + contractTokenBalance);
    // console.log("weth on lp: " +contractTokenBalanceWeth);
    balance = contractTokenBalance * sharePerc;
    //var wethBalance = contractTokenBalanceCrv * sharePerc;
  }

  return balance * 2; //can just approx value in cvx or cvxcrv by doubling
}

async function padHex(hexstring, intSize = 256) {
  hexstring = hexstring.replace("0x", "");

  var length = intSize / 4 - hexstring.length;
  for (var i = 0; i < length; i++) {
    hexstring = "0" + hexstring;
  }
  return hexstring;
}

async function numberToPaddedHex(number, intSize = 256) {
  var hexstr = number.toString(16);
  return padHex(hexstr, intSize);
}

async function BigNumber(number) {
  return number.toLocaleString("fullwide", {
    useGrouping: false,
  });
}

async function randomInt(min, max) {
  return Math.floor(min + Math.random() * Math.floor(max - min));
}

async function getPrice(contract_address, vsCoin) {
  var url =
    "https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=" +
    contract_address +
    "&vs_currencies=" +
    vsCoin;
  console.log(url);
  try {
    console.log("getPrice", { url });
    const { data } = await fetch(url);
    if (isNaN(data[contract_address.toLowerCase()][vsCoin.toLowerCase()])) {
      setTimeout(
        () => getPrice(contract_address, vsCoin),
        randomInt(2000, 6000)
      );
    } else {
      return data[contract_address.toLowerCase()][vsCoin.toLowerCase()];
    }
  } catch (e) {
    setTimeout(() => getPrice(contract_address, vsCoin), randomInt(2000, 6000));
  }
}
