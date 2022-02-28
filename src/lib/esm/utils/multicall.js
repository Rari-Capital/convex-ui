var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Contract } from "@ethersproject/contracts";
import { filterOnlyObjectProperties } from './filterOnlyObjectProperties';
const MULTICALL_ADDRESS = "0xeefba1e63905ef1d7acba5a8513c70307c1ce441";
const MULTICALL_ABI = [
    {
        constant: true,
        inputs: [],
        name: "getCurrentBlockTimestamp",
        outputs: [{ name: "timestamp", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: false,
        inputs: [
            {
                components: [
                    { name: "target", type: "address" },
                    { name: "callData", type: "bytes" },
                ],
                name: "calls",
                type: "tuple[]",
            },
        ],
        name: "aggregate",
        outputs: [
            { name: "blockNumber", type: "uint256" },
            { name: "returnData", type: "bytes[]" },
        ],
        payable: false,
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "getLastBlockHash",
        outputs: [{ name: "blockHash", type: "bytes32" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "addr", type: "address" }],
        name: "getEthBalance",
        outputs: [{ name: "balance", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "getCurrentBlockDifficulty",
        outputs: [{ name: "difficulty", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "getCurrentBlockGasLimit",
        outputs: [{ name: "gaslimit", type: "uint256" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [],
        name: "getCurrentBlockCoinbase",
        outputs: [{ name: "coinbase", type: "address" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
    {
        constant: true,
        inputs: [{ name: "blockNumber", type: "uint256" }],
        name: "getBlockHash",
        outputs: [{ name: "blockHash", type: "bytes32" }],
        payable: false,
        stateMutability: "view",
        type: "function",
    },
];
const createMultiCall = (provider) => new Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);
// type MulticallReturnData = [blockNumber: BigNumber, return]
export const callStaticWithMultiCall = (provider, encodedCalls, address) => __awaiter(void 0, void 0, void 0, function* () {
    const multicall = createMultiCall(provider);
    let options = {};
    if (!!address)
        options.address = address;
    const returnDatas = yield multicall.callStatic.aggregate(encodedCalls, options);
    return returnDatas;
});
export const encodeCall = (iface, contractAddress, functionName, params) => [contractAddress, iface.encodeFunctionData(functionName, [...params])];
export const decodeCall = (iface, functionName, txResult) => iface.decodeFunctionResult(functionName, txResult);
export const callInterfaceWithMulticall = (provider, iface, contractAddress, functionNames, params) => __awaiter(void 0, void 0, void 0, function* () {
    const encodedCalls = functionNames.map((funcName, i) => encodeCall(iface, contractAddress, funcName, params[i]));
    let result = filterOnlyObjectProperties(yield callStaticWithMultiCall(provider, encodedCalls));
    const { returnData } = result;
    const decodedCalls = functionNames.map((funcName, i) => decodeCall(iface, funcName, returnData[i]));
    return decodedCalls;
});
