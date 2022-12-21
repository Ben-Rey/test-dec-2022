import { generateEvent, createSC, fileToByteArray, transferCoins, call, Args } from "@massalabs/massa-as-sdk";

export function main(_args: StaticArray<u8>): StaticArray<u8> {
    const bytes: StaticArray<u8> = fileToByteArray("##Wasm_file_path##");
    const contractAddr = createSC(bytes);
    transferCoins(contractAddr, 10_000_000_000);

    let msg: string;
    if (contractAddr.isValid()) {
        msg = "Contract deployed and initialized at address:";
    } else {
        msg = "createSC returned an invalid address:";
    }

    call(contractAddr, "init", new Args(), 1000);

    generateEvent(`${msg} ${contractAddr.toByteString()}`);

    return [];
}
