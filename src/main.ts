import { ethers } from "ethers";
import { CCQDataSchema, CCQData } from "./model";

export default async function main(ccq: CCQData) {
    const {rpcAPIURL, privateKey, address, abi, type, method, args, value} = CCQDataSchema.parse(ccq);
    console.log("Loaded CCQ data.");
    const provider = new ethers.providers.JsonRpcProvider(rpcAPIURL, "any");
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(address, abi, signer)
    console.log("Created contract interface.");
    

    switch (type) {
        case "query":
            console.log("Querying contract...");
            const response = await contract[method](...args);
            console.log(response);
            break;
        case "command":
            console.log("Creating command transatction...");
            console.log("Estimating gas...");
            const estimatedGasLimit = await contract.estimateGas[method](...args);
            const currentGasPrice = await provider.getGasPrice();
            console.log("Populating transaction...");
            const txUnsigned = await contract.populateTransaction[method](...args);
            txUnsigned.chainId = 5;
            txUnsigned.gasLimit = estimatedGasLimit;
            txUnsigned.gasPrice = currentGasPrice;
            txUnsigned.nonce = await provider.getTransactionCount(address) + 10;
            txUnsigned.value = ethers.utils.parseEther(value.toString())

            console.log("Signing transaction...");
            const txSigned = await signer.signTransaction(txUnsigned);
            console.log("Sending transaction...");
            const submittedTx = await provider.sendTransaction(txSigned);
            const receipt = await submittedTx.wait();
            console.log(`https://goerli.etherscan.io/address/${receipt.transactionHash}`);
            if (receipt.status === 0)
                throw new Error("Transaction failed.");
            break;
    }
}