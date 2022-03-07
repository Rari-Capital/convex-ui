import { constants } from "ethers";
import { MarketsWithData } from "lib/esm/types";
import { useQuery } from "react-query";
import { getBorrowLimit } from "./getBorrowLimit";

/**
 * @param marketsDynamicData - Response from the lens.
 * @returns - The user's health (0-100% where the closer to 100 the closer to liquidation), and the borrow limit.
 */
const useUserHealth = (marketsDynamicData: MarketsWithData | undefined) => {
  const { data: borrowLimit } = useQuery(
    "User's borrow limit and health",
    () => {
      if (!marketsDynamicData) return;

      const borrowLimitBN = getBorrowLimit(marketsDynamicData.assets);
      const healthBN = borrowLimitBN.eq(0)
        ? constants.Zero
        : marketsDynamicData.totalBorrowBalanceUSD.mul(100).div(borrowLimitBN);

      const userHealth = parseFloat(healthBN.toString());
      const borrowLimit = parseFloat(borrowLimitBN.toString());

      return { userHealth, borrowLimit, borrowLimitBN };
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: marketsDynamicData ? true : false,
    }
  );

  return {
    userHealth: borrowLimit?.userHealth ?? 0,
    borrowLimit: borrowLimit?.borrowLimit ?? 0,
    borrowLimitBN: borrowLimit?.borrowLimitBN ?? constants.Zero,
  };
};

export default useUserHealth;
