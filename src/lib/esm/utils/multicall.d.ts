import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { Interface } from "@ethersproject/abi";
declare type EncodedCall = [string, any];
export declare const callStaticWithMultiCall: (provider: JsonRpcProvider | Web3Provider, encodedCalls: EncodedCall[], address?: string) => Promise<any>;
export declare const encodeCall: (iface: Interface, contractAddress: string, functionName: string, params: any[]) => EncodedCall;
export declare const decodeCall: (iface: Interface, functionName: string, txResult: any) => any;
export declare const callInterfaceWithMulticall: (provider: JsonRpcProvider | Web3Provider, iface: Interface, contractAddress: string, functionNames: string[], params: any[][]) => Promise<any[]>;
export {};
