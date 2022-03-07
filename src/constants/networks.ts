
type Config = {
    [chainId: number]: {
        poolId: number
    }
}

export const networkConfig: Config = {
    1: {
        poolId: 156
    },
    31337: {
        poolId: 1
    }
}

export const isSupportedChainId = (chainId?: number) => chainId && !!Object.keys(networkConfig).includes(chainId.toString())