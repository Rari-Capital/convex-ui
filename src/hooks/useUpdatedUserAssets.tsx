import { USDPricedFuseAsset } from "lib/esm/types";
import { BigNumber, constants, utils } from "ethers";
import { usePoolContext } from "context/PoolContext";
import { useQuery, UseQueryResult } from "react-query";
import { useMemo } from "react";
import { ActionType } from "components/pages/Pool";

export const useUpdatedUserAssets = ({
  action,
  index,
  assets,
  amount,
}: {
  action: ActionType;
  assets: USDPricedFuseAsset[];
  index: number;
  amount: BigNumber;
}) => {
  const { pool } = usePoolContext();

  const { data: updatedAssets }: UseQueryResult<USDPricedFuseAsset[]> =
    useQuery(
      action + " " + index + " " + assets.map(asset => asset.cToken).join(",") + " " + amount,
      async () => {
        if (!assets || !assets.length || !pool) return [];

        const ethPrice: BigNumber = await pool.getEthUsdPriceBN();

        const assetToBeUpdated = assets[index];

        const interestRateModel = await pool.getInterestRateModel(
          assetToBeUpdated.cToken
        );

        let updatedAsset: USDPricedFuseAsset;
        if (action === ActionType.SUPPLY) {
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
        } else if (action === ActionType.WITHDRAW) {
          const supplyBalance = assetToBeUpdated.supplyBalance.sub(amount);
          const totalSupply = assetToBeUpdated.totalSupply.sub(amount);

          updatedAsset = {
            ...assetToBeUpdated,

            supplyBalance,
            supplyBalanceUSD: supplyBalance
              .mul(assetToBeUpdated.underlyingPrice)
              .mul(ethPrice)
              .div(constants.WeiPerEther.pow(3)),

            totalSupply,
            supplyRatePerBlock: interestRateModel.getSupplyRate(
              totalSupply.gt(constants.Zero)
                ? assetToBeUpdated.totalBorrow
                    .div(totalSupply)
                    .mul(constants.WeiPerEther)
                : constants.Zero
            ),
          };
        } else if (action === ActionType.BORROW) {
          const borrowBalance = assetToBeUpdated.borrowBalance.add(amount);

          const totalBorrow = assetToBeUpdated.totalBorrow.add(amount);

          let newUtilRate = assetToBeUpdated.totalSupply.eq(0)
            ? constants.Zero
            : totalBorrow
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
        } else if (action === ActionType.REPAY) {
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
              .mul(ethPrice)
              .div(constants.WeiPerEther.pow(3)),
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
