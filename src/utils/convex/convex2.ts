import { BigNumber, Contract } from "ethers";
import { ConvexPool, pools } from "./convexpools";
import { formatUnits } from "ethers/lib/utils";

import BaseRewardPoolABI from "./abis/convex/BaseRewardPool.json";
import SwapABI from "./abis/convex/Swap.json";
import DepositTokenABI from "./abis/convex/DepositToken.json";

export async function convexAPR(poolName: string, provider: any) {
  return await convexAPRWithPrice(poolName, -1, -1, provider);
}

export interface ConvexData {
  poolName: string;
  pool: ConvexPool;
  crvPrice: number;
  cvxPrice: number;
  rate: number;
  lpVirtualPrice: number;
  supply: number;
  virtualSupplyUSD: number;
  crvPerUnderlying: number;
  crvPerYear: number;
  cvxPerYear: number;
  apr: number;
}

async function convexAPRWithPrice(
  poolName: string,
  crvPrice: number,
  cvxPrice: number,
  provider: any
): Promise<ConvexData | undefined> {
  var pool = pools.find((pool) => pool.name == poolName);
  if (!pool) return;
  var curveSwap = pool.swap;
  var stakeContractAddress = pool.crvRewards;

  //get reward rate
  const rate = await rewardRate(stakeContractAddress, provider);

  //get LP Virtual price
  let lpVirtualPrice = 1;
  if (pool.isV2 == false) {
    lpVirtualPrice = await curveLpValue(1, curveSwap, provider);
  } else {
    lpVirtualPrice = await curveV2LpValue(pool, provider);
  }

  //get LP Token supply
  let supply = await supplyOf(stakeContractAddress, provider);

  // Get LP virtual Supply USD
  let virtualSupplyUSD = supply * lpVirtualPrice;

  //crv per underlying per second
  let crvPerUnderlying = rate / virtualSupplyUSD;

  //crv per year
  let crvPerYear = crvPerUnderlying * 86400 * 365;
  let cvxPerYear = await getCVXMintAmount(crvPerYear, provider);

  if (cvxPrice <= 0) cvxPrice = await getPrice(cvxAddress, pool.currency);

  var apr = crvPerYear * crvPrice;
  apr += cvxPerYear * cvxPrice;
  console.log("apr of crv/cvx: " + apr);
  if (pool.extras != undefined && pool.extras.length > 0) {
    for (var i in pool.extras) {
      var ex = pool.extras[i];
      var exrate = await rewardRate(ex.contract, provider);
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
    return undefined;
  }

  const result: ConvexData = {
    poolName,
    pool,
    crvPrice,
    cvxPrice,
    rate,
    lpVirtualPrice,
    supply,
    virtualSupplyUSD,
    crvPerUnderlying,
    crvPerYear,
    cvxPerYear,
    apr,
  };

  return result;
}

async function rewardRate(stakeContractAddress: string, provider: any) {
  const stakeContract = new Contract(
    stakeContractAddress,
    BaseRewardPoolABI,
    provider
  );
  const rewardRate: BigNumber = await stakeContract.callStatic.rewardRate();
  console.log({ rewardRate }, rewardRate.toString());
  const decimal = Math.pow(10, 18);
  const rate = parseInt(rewardRate._hex, 16) / decimal;
  return rate;
}

// Gets the total USD value of a Curve V1 LP
async function curveLpValue(
  amount: number,
  swapAddress: string,
  provider: any
) {
  const swapContract = new Contract(
    swapAddress,
    JSON.stringify(SwapABI),
    provider
  );

  const virtualPrice: BigNumber =
    await swapContract.callStatic.get_virtual_price();

  const priceDecimal = Math.pow(10, 18);
  const pricePerShare = parseInt(virtualPrice._hex, 16) / priceDecimal;

  return amount * pricePerShare;
}

// Gets the total USD Value of a Curve LP V2
async function curveV2LpValue(pool: ConvexPool, provider: any) {
  const { currency: currencyType } = pool;

  //get amount of tokens
  var supply = await supplyOf(pool.lptoken, provider);

  // If v2, we can assume pool.coins is populated
  var total = 0;
  for (var i = 0; i < pool.coins!.length; i++) {
    const bal = await balanceOf(
      pool.swap,
      pool.coins![i],
      pool.coinDecimals![i],
      provider
    );
    //console.log("bal: " +i +" = " +bal);
    const price = await getPrice(pool.coins![i], currencyType);

    // console.log("price: " +i +" = " +price);
    total += bal * price;
  }

  let value = total / supply;
  if (isNaN(value)) return 0;
  return total;
}

// Gets totalSupply of LP token
async function supplyOf(contractAddress: string, provider: any) {
  const tokenContract = new Contract(
    contractAddress,
    DepositTokenABI,
    provider
  );
  const totalSupply: BigNumber = await tokenContract.callStatic.totalSupply();
  const decimals = Math.pow(10, 18); // assume 18 decimals
  const supply = parseInt(totalSupply._hex, 16) / decimals;
  return supply;
}

// Gets LP balance of token
async function balanceOf(
  address: string,
  tokenAddress: string,
  decimals: number,
  provider: any
) {
  const tokenContract = new Contract(tokenAddress, DepositTokenABI, provider);
  const totalSupplyBN: BigNumber = await tokenContract.callStatic.balanceOf(
    address
  );
  const totalSupply = parseFloat(formatUnits(totalSupplyBN, decimals));
  return totalSupply;
}

// Fetches price from coingecko
async function getPrice(tokenAddress: string, vsCoin: string) {
  var url =
    "https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=" +
    tokenAddress +
    "&vs_currencies=" +
    vsCoin;
  console.log("getPrice", { url });
  try {
    const response = await fetch(url);
    const data = await response.json();

    // If it doesnt fetch data, requery
    if (isNaN(data[tokenAddress.toLowerCase()][vsCoin.toLowerCase()])) {
      setTimeout(() => getPrice(tokenAddress, vsCoin), 5000);
    } else {
      return data[tokenAddress.toLowerCase()][vsCoin.toLowerCase()];
    }
  } catch (e) {
    setTimeout(() => getPrice(tokenAddress, vsCoin), 5000);
  }
}

////--------------- Util  -------------------///

let crvAddress = "0xD533a949740bb3306d119CC777fa900bA034cd52";
let cvxAddress = "0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B";
let cvxCrvAddress = "0x62B9c7356A2Dc64a1969e19C23e4f579F9810Aa7";

let cliffSize = 100000; // * 1e18; //new cliff every 100,000 tokens
let cliffCount = 1000; // 1,000 cliffs
let maxSupply = 100000000; // * 1e18; //100 mil max supply

async function getCVXMintAmount(crvEarned: number, provider: any) {
  //first get total supply
  var cvxSupply = await supplyOf(cvxAddress, provider);
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
