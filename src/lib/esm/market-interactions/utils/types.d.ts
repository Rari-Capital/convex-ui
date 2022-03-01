export declare enum ComptrollerErrorCodes {
    NO_ERROR = 0,
    UNAUTHORIZED = 1,
    COMPTROLLER_MISMATCH = 2,
    INSUFFICIENT_SHORTFALL = 3,
    INSUFFICIENT_LIQUIDITY = 4,
    INVALID_CLOSE_FACTOR = 5,
    INVALID_COLLATERAL_FACTOR = 6,
    INVALID_LIQUIDATION_INCENTIVE = 7,
    MARKET_NOT_ENTERED = 8,
    MARKET_NOT_LISTED = 9,
    MARKET_ALREADY_LISTED = 10,
    MATH_ERROR = 11,
    NONZERO_BORROW_BALANCE = 12,
    PRICE_ERROR = 13,
    REJECTION = 14,
    SNAPSHOT_ERROR = 15,
    TOO_MANY_ASSETS = 16,
    TOO_MUCH_REPAY = 17,
    SUPPLIER_NOT_WHITELISTED = 18,
    BORROW_BELOW_MIN = 19,
    SUPPLY_ABOVE_MAX = 20
}
export declare enum CTokenErrorCodes {
    NO_ERROR = 0,
    UNAUTHORIZED = 1,
    BAD_INPUT = 2,
    COMPTROLLER_REJECTION = 3,
    COMPTROLLER_CALCULATION_ERROR = 4,
    INTEREST_RATE_MODEL_ERROR = 5,
    INVALID_ACCOUNT_PAIR = 6,
    INVALID_CLOSE_AMOUNT_REQUESTED = 7,
    INVALID_COLLATERAL_FACTOR = 8,
    MATH_ERROR = 9,
    MARKET_NOT_FRESH = 10,
    MARKET_NOT_LISTED = 11,
    TOKEN_INSUFFICIENT_ALLOWANCE = 12,
    TOKEN_INSUFFICIENT_BALANCE = 13,
    TOKEN_INSUFFICIENT_CASH = 14,
    TOKEN_TRANSFER_IN_FAILED = 15,
    TOKEN_TRANSFER_OUT_FAILED = 16,
    UTILIZATION_ABOVE_MAX = 17
}
