require("dotenv").config()

import main from "./main";

main({
    address: "0xf1f591399a4f17f9B3575b5b5Dd35Ab0c1DFFC2c",
    rpcAPIURL: `https://eth-goerli.g.alchemy.com/v2/${process.env.RPC_API_KEY}`,
    privateKey: process.env.PRIVATE_KEY!,
    method: "deposit",
    args: [],
    type: "command",
    abi: require("./abi.json"),
    value: 0.02
});