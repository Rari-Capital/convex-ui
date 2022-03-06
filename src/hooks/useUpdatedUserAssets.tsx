import { USDPricedFuseAsset } from "lib/esm/types";
import { BigNumber, constants, utils } from "ethers";
import { usePoolContext } from "context/PoolContext";
import { useQuery, UseQueryResult } from "react-query";
import { useMemo } from "react";

export const useUpdatedUserAssets = ({
    mode,
    index,
    assets,
    amount,
  }: {
    mode: "supply" | "borrow" | "withdraw" | "repay";
    assets: USDPricedFuseAsset[];
    index: number;
    amount: BigNumber;
  }) => {
    
    const { pool } = usePoolContext()

    const { data: updatedAssets }: UseQueryResult<USDPricedFuseAsset[]> =
      useQuery(
        mode + " " + index + " " + JSON.stringify(assets) + " " + amount,
        async () => {
          if (!assets || !assets.length || !pool) return [];
  
          const ethPrice: BigNumber = await pool.getEthUsdPriceBN();
  
          const assetToBeUpdated = assets[index];
  
          const interestRateModel = await pool.getInterestRateModel(
            assetToBeUpdated.cToken
          );
  
          let updatedAsset: USDPricedFuseAsset;
          if (mode === "supply") {
            const supplyBalance = assetToBeUpdated.supplyBalance.add(amount);
  
            const totalSupply = assetToBeUpdated.totalSupply.add(amount);
  
            updatedAsset = {
              ...assetToBeUpdated,
  
              supplyBalance,
              supplyBalanceUSD: supplyBalance
              .mul(assetToBeUpdated.underlyingPrice)
              .mul(ethPrice)
              .div(constants.WeiPerEther.pow(3)),
  
              totalSupply,
              supplyRatePerBlock: interestRateModel.getSupplyRate(
                totalSupply.gt(0)
                  ? assetToBeUpdated.totalBorrow
                      .mul(constants.WeiPerEther)
                      .div(totalSupply)
                  : constants.Zero
              ),
            };
          } else if (mode === "withdraw") {
            const supplyBalance = assetToBeUpdated.supplyBalance.sub(amount);
            const totalSupply = assetToBeUpdated.totalSupply.sub(amount);
  
            updatedAsset = {
              ...assetToBeUpdated,
  
              supplyBalance,
              supplyBalanceUSD: supplyBalance
                .mul(assetToBeUpdated.underlyingPrice)
                .mul(utils.parseEther(ethPrice.toString()))
                .div(constants.WeiPerEther),
  
              totalSupply,
              supplyRatePerBlock: interestRateModel.getSupplyRate(
                totalSupply.gt(constants.Zero)
                  ? assetToBeUpdated.totalBorrow
                      .div(totalSupply)
                      .mul(constants.WeiPerEther)
                  : constants.Zero
              ),
            };
          } else if (mode === "borrow") {
            const borrowBalance = assetToBeUpdated.borrowBalance.add(amount);
  
            const totalBorrow = assetToBeUpdated.totalBorrow.add(amount);
  
            let newUtilRate = assetToBeUpdated.totalSupply.eq(0) ? constants.Zero : totalBorrow
              .mul(constants.WeiPerEther)
              .div(assetToBeUpdated.totalSupply);
  
            updatedAsset = {
              ...assetToBeUpdated,
  
              borrowBalance,
              borrowBalanceUSD: borrowBalance
              .mul(assetToBeUpdated.underlyingPrice)
              .mul(ethPrice)
              .div(constants.WeiPerEther.pow(3)),
  
              totalBorrow,
              borrowRatePerBlock: interestRateModel.getBorrowRate(
                assetToBeUpdated.totalSupply.gt(constants.Zero)
                  ? newUtilRate
                  : constants.Zero
              ),
            };
          } else if (mode === "repay") {
            const borrowBalance = assetToBeUpdated.borrowBalance.sub(amount);
  
            const totalBorrow = assetToBeUpdated.totalBorrow.sub(amount);
  
            let newUtilRate = totalBorrow
              .mul(constants.WeiPerEther)
              .div(assetToBeUpdated.totalSupply);
  
            const borrowRatePerBlock = interestRateModel.getBorrowRate(
              assetToBeUpdated.totalSupply.gt(constants.Zero)
                ? newUtilRate
                : constants.Zero
            );
  
            updatedAsset = {
              ...assetToBeUpdated,
  
              borrowBalance,
              borrowBalanceUSD: borrowBalance
                .mul(assetToBeUpdated.underlyingPrice)
                .mul(utils.parseEther(ethPrice.toString()))
                .div(constants.WeiPerEther),
              totalBorrow,
              borrowRatePerBlock,
            };
          }
          const ret = assets.map((value, _index) => {
            if (_index === index) {
              return updatedAsset;
            } else {
              return value;
            }
          });
  
          return ret;
        }
      );
  
    return useMemo(() => updatedAssets, [updatedAssets]);
  };