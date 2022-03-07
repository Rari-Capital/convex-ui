export function getUnderlyingBalancesForPool(markets) {
    let balances = {};
    for (const market of markets) {
        balances[market.cToken] = market.underlyingBalance;
    }
    return balances;
}
