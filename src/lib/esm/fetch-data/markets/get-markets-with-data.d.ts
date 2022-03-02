import { Options } from '../../types';
import { MarketsWithData } from '../../types';
/**
 * @param comptrollerAddress - Comptroller to look for.
 * @param userAddress - User to get information for.
 * @param addressToGetBalanceFor - Will be used to get total supplied/borrowed for address.
 * @returns - Async function call to get all public pools.
 */
export declare function getMarketsWithData(comptrollerAddress: string, options?: Options): Promise<MarketsWithData>;
