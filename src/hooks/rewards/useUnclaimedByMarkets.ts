import { usePoolContext } from "context/PoolContext";
import { useRari } from "context/RariContext";
import { BigNumber, Contract } from "ethers";

import FlywheelLensABI from "contracts/abi/FlywheelRouter.json";
import { useQuery } from "react-query";

const LENS_ADDRESS = "0x8301bfd36b10e02464ebc64c3362caf18a44203e";

const flywheels = {
  CRV: "0x65DFbde18D7f12a680480aBf6e17F345d8637829",
  CVX: "0x18B9aE8499e560bF94Ef581420c38EC4CfF8559C",
  LDO: "0x18B9aE8499e560bF94Ef581420c38EC4CfF8559C",
};

export type FlywheelRewardsByMarket = {
  [cToken: string]: FlywheelRewardsForMarket;
};

type FlywheelRewardsForMarket = {
  [flywheel: string]: BigNumber;
};

const useUnclaimedByMarkets = () => {
  const { provider, address } = useRari();
  const { marketsDynamicData } = usePoolContext();

  const lens = new Contract(LENS_ADDRESS, JSON.stringify(FlywheelLensABI), provider);
  const cTokens = marketsDynamicData?.assets.map((market) => market.cToken);

  const { data, error } = useQuery(
    `Unclaimed by ${address} for markets ${cTokens?.join(" + ")}`,
    async () => {
      if (!cTokens || !cTokens.length) return undefined;

      const accrue = new Array(Object.keys(flywheels).length).fill(true);
      const claimRewards = new Array(cTokens.length).fill(true);

      let flywheelRewards: FlywheelRewardsByMarket = {};

      cTokens.forEach(async (cToken) => {
        try {
          const obj = {
            address,
            cToken, 
            flywheels,
            accrue,
            true: true,
          };
          console.log({ obj });

        //   let result = await lens.callStatic.getUnclaimedRewardsForMarket(
        //     address,
        //     cToken,
        //     flywheels,
        //     accrue,
        //     true
        //   );

        //   console.log({ result });

        //   flywheelRewards[cToken] = Object.fromEntries(
        //     Object.keys(flywheels).map((k, i) => [k, result[i]])
        //   ); 
        } catch {
          console.error("error fetching CToken Rewards for " + cToken);
        }
      });

      return flywheelRewards;
    }
  );

  //   console.log({ marketsStaticData, lens, data });
  return data;
};

export default useUnclaimedByMarkets;
