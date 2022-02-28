import { MarketsWithData, Options } from '../../types';
/**
 * @param comptrollerAddress - Comptroller to look for.
 * @param userAddress - User to get information for.
 * @param oracleAddress - The pool's oracle address.
 * @returns - Dynamic data for all listed markets.
 */
export declare function getAllMarketsWithDynamicData(comptrollerAddress: string, userAddress: string, oracleAddress: string, options?: Options): Promise<MarketsWithData>;
