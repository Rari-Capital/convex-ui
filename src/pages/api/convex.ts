// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { convexAPR, ConvexData } from "utils/convex/convex2";

const pools = [
  "frax",
  "steth",
  "ust-wormhole",
  "tricrypto2",
  "d3pool",
  "fei",
  "alusd",
];

export const alchemyURL = `https://eth-mainnet.alchemyapi.io/v2/2Mt-6brbJvTA4w9cpiDtnbTo6qOoySnN`;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { data } = await axios.get(
    "https://www.convexfinance.com/api/curve-apys"
  );
  const { apys: apiAPYs } = data;

  const apys = Object.fromEntries(Object.entries(apiAPYs).filter(([key]) => pools.includes(key)));

  const provider = new JsonRpcProvider(alchemyURL)

  let map: {[pool: string]: ConvexData} = {}
  await Promise.all(pools.map(async key => {
    try {
        const extraAPYData = await convexAPR(key, provider)
        map[key] = extraAPYData!
    } catch {}
  }))

  res.status(200).json({apys, map});
};
