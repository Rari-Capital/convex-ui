"use strict";
// // Ethers
// import { Web3Provider, JsonRpcProvider } from "@ethersproject/providers";
// import { Contract } from "@ethersproject/contracts";
// import { Interface } from "@ethersproject/abi";
// /**
//  * @param comptrollerAddress - The comptroller address to call.
//  * @param provider - An initiated ethers provider.
//  * @returns an async function call to get IncentivesData
//  */
//  export async function fetchRewardsSpeedByPool (
//     comptrollerAddress: string,
//     provider: Web3Provider | JsonRpcProvider,
//   ): Promise<any>{
//     const fuseLensInterface = new Interface([
//       'function getRewardSpeedsByPool(address comptroller) public view returns (address[] memory, address[] memory, address[] memory, uint256[][] memory, uint256[][] memory)'
//     ])
//     const fuseLensSecondaryInterface = new Contract(
//       this.addresses.FUSE_POOL_LENS_SECONDARY_CONTRACT_ADDRESS,
//       fuseLensInterface,
//       provider
//     )
//     return await fuseLensSecondaryInterface.callStatic.getRewardSpeedsByPool(
//       comptrollerAddress
//     );
//   }
