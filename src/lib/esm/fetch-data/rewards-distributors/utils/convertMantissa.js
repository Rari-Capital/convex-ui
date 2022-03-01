export const toInt = (input) => {
    if (!input)
        return 0;
    return parseInt(input.toString());
};
export const convertMantissaToAPY = (mantissa, dayRange = 35) => {
    const parsedMantissa = toInt(mantissa);
    return (Math.pow((parsedMantissa / 1e18) * 6500 + 1, dayRange) - 1) * 100;
};
export const convertMantissaToAPR = (mantissa) => {
    const parsedMantissa = toInt(mantissa);
    return (parsedMantissa * 2372500) / 1e16;
};
