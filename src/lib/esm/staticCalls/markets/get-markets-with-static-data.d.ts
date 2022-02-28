import { StaticData } from "../../types";
/**
 *
 * @param comptrollerAddress - The pool's comptroller address.
 * @param oracleAddress - The pool's oracle address.
 * @returns - Static data for all listed markets.
 */
export declare function getAllMarketsWithStaticData(comptrollerAddress: string, oracleAddress: string): Promise<StaticData[]>;
