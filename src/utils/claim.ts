export default true;

// import { BigNumber, Contract } from "ethers";
// import LensRouter from "../../contracts/abi/FlywheelLensRouter.json";

// const sri = "0xB290f2F3FAd4E540D0550985951Cdad2711ac34A";

// export type CTokenRewardsByMarket = {
//   [cTokenAddress: string]: CTokenRewardsForMarket;
// };

// type CTokenRewardsForMarket = {
//   [flywheelAddress: string]: BigNumber;
// };

// export const getUnclaimedRewardsByMarkets = async (
//   provider: any,
//   user: string,
//   markets: string[],
//   flywheels: string[]
// ): Promise<CTokenRewardsByMarket> => {
//   const accrue = new Array(flywheels.length).fill(true);
//   const claimPlugins = new Array(markets.length).fill(true);

//   const lens = new Contract(
//     "0x8301bfd36b10e02464ebc64c3362caf18a44203e",
//     LensRouter,
//     provider
//   );

//   let cTokenRewards: CTokenRewardsByMarket = {};

//   markets.forEach(async (market, index) => {
//     try {
//       const result: [unclaimed: BigNumber] =
//         await lens.callStatic.getUnclaimedRewardsForMarket(
//           user,
//           market,
//           flywheels,
//           accrue,
//           claimPlugins[index]
//         );
//       cTokenRewards[market] = Object.fromEntries(
//         flywheels.map((k, i) => [k, result[i]])
//       );
//     } catch (err) {}
//   });

//   console.log({
//     user,
//     markets,
//     flywheels,
//     accrue,
//     claimPlugins,
//     lens,
//     cTokenRewards,
//   });

//   return cTokenRewards;
// };
