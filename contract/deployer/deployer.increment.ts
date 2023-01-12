import { generateEvent, createSC, fileToByteArray, transferCoins, call, Args } from "@massalabs/massa-as-sdk";

export function main(_args: StaticArray<u8>): StaticArray<u8> {
    const bytes: StaticArray<u8> = fileToByteArray("build/token.wasm");
    const contractAddr = createSC(bytes);
    transferCoins(contractAddr, 10_000_000_000);
    // const ownerAddress = new Address("A1sVmQZodxtyeFg1iCeoPMbtJVx1nfXf8YZALqCGMjaXSXMWzy7"); // testnet

    let msg: string;
    if (contractAddr.isValid()) {
        msg = "Contract deployed and initialized at Adrro:";
    } else {
        msg = "createSC returned an invalid address:";
    }

    const decimals = 2;
    const totalSupply = 10000000 * 10 ** decimals;

    call(contractAddr, "init", new Args().add("increment").add("inc").add(decimals).add(totalSupply), 1000);
    // const balance = fromBytes(call(contractAddr, "balanceOf", new Args().add(ownerAddress), 0));

    generateEvent(`${msg} ${contractAddr.toByteString()}`);

    return [];
}
