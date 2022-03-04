import { MarketsWithData } from "lib/esm/types"
import { useQuery } from "react-query"
import { getBorrowLimit } from "./getBorrowLimit"

/**
 * @param marketsDynamicData - Response from the lens.
 * @returns - The user's health (0-100% where the closer to 100 the closer to liquidation), and the borrow limit.
 */
const useUserHealth = (
    marketsDynamicData: MarketsWithData | undefined
) => {
    const { data: borrowLimit } = useQuery("User's borrow limit and health", () => {
        if (!marketsDynamicData) return

        const borrowLimitBN = getBorrowLimit(marketsDynamicData.assets)
        const healthBN = marketsDynamicData.totalBorrowBalanceUSD.mul(100).div(borrowLimitBN)

        const userHealth = parseFloat(healthBN.toString())
        const borrowLimit = parseFloat(borrowLimitBN.toString())

        return { userHealth, borrowLimit }
    }, {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: marketsDynamicData ? true : false
    })

    return {userHealth: borrowLimit?.userHealth, borrowLimit: borrowLimit?.borrowLimit}
}

export default useUserHealth