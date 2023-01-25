import { ethers } from "ethers";
import { CCQDataSchema } from "./model";

export default async function main(abi: string, ccq: string) {
    const contractAbi = require(abi);
    const ccqData = CCQDataSchema.parse(require(ccq));

    const provider = new ethers.providers.JsonRpcProvider(ccqData.rpcAPIUrl, 1);
    const signer = new ethers.Wallet(ethers.utils.formatBytes32String(ccqData.privateKey), provider);
    const contract = new ethers.Contract(ccqData.address, contractAbi, signer);

    switch (ccqData.type) {
        case "query":
            const response = await contract[ccqData.method](...ccqData.args);
            console.log(response);
            break;
        case "command":
            const estimatedGasLimit = await contract.estimateGas[ccqData.method](...ccqData.args);
            const txUnsigned = await contract.populateTransaction[ccqData.method](...ccqData.args);
            txUnsigned.chainId = 1;
            txUnsigned.gasLimit = estimatedGasLimit;
            txUnsigned.gasPrice = await provider.getGasPrice();
            txUnsigned.nonce = await provider.getTransactionCount(ccqData.address);

            const txSigned = await signer.signTransaction(txUnsigned);
            const submittedTx = await provider.sendTransaction(txSigned);
            const receipt = await submittedTx.wait();
            if (receipt.status === 0)
                throw new Error("Transaction failed.");
            else console.log("Transaction successful.");
            break;
    }
}