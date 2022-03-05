import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { BigNumber, constants, Contract } from "ethers";

import FlywheelLensABI from "contracts/abi/FlywheelRouter.json";
import { useQuery } from "react-query";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useCallback, useMemo } from "react";
import { Web3Provider } from "@ethersproject/providers";

const FLYWHEEL_LENS_ROUTER = "0x8301bfd36b10e02464ebc64c3362caf18a44203e";

type FlywheelData = {
  [flywheel: string]: {
    rewardToken: string;
    rewardTokenSymbol: string;
    rewardTokenDecimals: number;
  };
};

export const flywheels: FlywheelData = {
  "0x65DFbde18D7f12a680480aBf6e17F345d8637829": {
    rewardToken: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    rewardTokenSymbol: "CRV",
    rewardTokenDecimals: 18,
  },
  "0x18B9aE8499e560bF94Ef581420c38EC4CfF8559C": {
    rewardToken: "0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b",
    rewardTokenSymbol: "CVX",
    rewardTokenDecimals: 18,
  },
  "0x506ce4145833e55000cbd4c89ac9ba180647eb5e": {
    rewardToken: "0x5a98fcbea516cf06857215779fd812ca3bef1b32",
    rewardTokenSymbol: "LDO",
    rewardTokenDecimals: 18,
  },
};

// Mapping of flywheel -> Undelrying Claimable
type FlywheelRewardsTotal = {
  [flywheel: string]: BigNumber;
};

type FlywheelRewardsTotalUSD = {
  [flywheel: string]: number;
};

export type FlywheelRewardsByMarket = {
  [cToken: string]: FlywheelRewardsTotal;
};

export const useMaxUnclaimedByMarkets = (cTokens: string[]) => {
  const { provider, address } = useRari();

  const lens = new Contract(
    FLYWHEEL_LENS_ROUTER,
    JSON.stringify(FlywheelLensABI),
    provider
  );

  // TODO - remove hardcode
  const flywheelAddresses = Object.keys(flywheels);
  const accrueForAll = new Array(flywheelAddresses.length).fill(true);
  const claimRewards = new Array(cTokens.length).fill(true);

  const { data, error } = useQuery(
    `Unclaimed by ${address} for markets ${cTokens?.join(" + ")}`,
    async () => {
      if (!cTokens || !cTokens.length || !address) return undefined;
      let flywheelRewardsTotals: FlywheelRewardsTotal = {};

      try {
        const obj = {
          address,
          cTokens,
          flywheelAddresses,
          accrueForAll,
          claimRewards,
        };

        let result: BigNumber[] =
          await lens.callStatic.getUnclaimedRewardsByMarkets(
            address,
            cTokens,
            flywheelAddresses,
            accrueForAll,
            claimRewards
          );

        result.forEach(
          (claimable, i) =>
            (flywheelRewardsTotals[flywheelAddresses[i]] = claimable)
        );

        let estimatedGas = await lens.estimateGas.getUnclaimedRewardsByMarkets(
          address,
          cTokens,
          flywheelAddresses,
          accrueForAll,
          claimRewards
        );

        console.log({ obj, result, flywheelRewardsTotals });

        return { flywheelRewardsTotals, estimatedGas };
      } catch (err) {
        console.error(
          "error fetching CToken Rewards for " + cTokens.join(", ")
        );
      }
    }
  );

  const call = useCallback(() => {
    if (!address || !cTokens || !cTokens.length) return undefined;

    return lens.populateTransaction
      .getUnclaimedRewardsByMarkets(
        address,
        cTokens,
        flywheelAddresses,
        accrueForAll,
        claimRewards,
        { from: address }
      )
      .then((unsignedTx) => {
        const signer = (provider as Web3Provider).getSigner(address);
        return signer.sendTransaction(unsignedTx);
      });
  }, [address, cTokens, provider]);

  return { ...data, call };
};

export const useFlywheelsTotalUSD = (
  flywheelRewards?: FlywheelRewardsTotal
) => {
  const { poolInfo, pool } = usePoolContext();

  //   TODO: remove hardcoded flywheel
  const flywheelsAddresses = Object.keys(flywheelRewards ?? {});

  const { data, error } = useQuery(
    `USD Value Of flywheels ${flywheelsAddresses.join(", ")} for pool ${
      poolInfo?.id
    }`,
    async () => {
      if (!poolInfo || !pool || !flywheelRewards) return;
      let flywheelRewardsTotalsUSD: FlywheelRewardsTotalUSD = {};
      let sumUSD = 0;

      const ethUSD = await pool.getEthUsdPriceBN();

      await Promise.all(
        flywheelsAddresses.map(async (flywheelAddress) => {
          const ethPrice = await pool.getPriceFromOracle(
            flywheels[flywheelAddress].rewardToken,
            poolInfo!.oracle
          );

          // amountUSD = claimable by user * ethPrice * ethUSD
          const amountUSD = parseFloat(
            formatEther(
              flywheelRewards[flywheelAddress]
                .mul(ethPrice)
                .mul(ethUSD)
                .div(constants.WeiPerEther)
                .div(constants.WeiPerEther)
            )
          );

          flywheelRewardsTotalsUSD[flywheelAddress] = amountUSD;
          sumUSD += amountUSD;
        })
      );

      return { flywheelRewardsTotalsUSD, sumUSD };
    }
  );

  const { flywheelRewardsTotalsUSD, sumUSD } = data ?? {
    flywheelRewardsTotalsUSD: {},
    sumUSD: 0,
  };
  return { flywheelRewardsTotalsUSD, sumUSD };
};
