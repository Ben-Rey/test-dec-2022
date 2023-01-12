import { Address, Args, call, Context, fromBytes, generateEvent } from "@massalabs/massa-as-sdk";

// Function used to test the get_value fonction
export function main(): void {
    // First we provide the address of the increment contract
    const address = new Address("A12vEzLbm4gLyS6f1ygSzRXuHQ4xMJnFEzaLvJmRcmYHiwqLhYQr"); // testnet
    const ownerAddress = new Address("A1sVmQZodxtyeFg1iCeoPMbtJVx1nfXf8YZALqCGMjaXSXMWzy7"); // testnet

    // const ownerAddress = Context.caller();
    // testnet
    // Then we call the function get_value which return the last sotred number
    // const result = fromBytes(call(address, "transferFrom", new Args().add(address).add(ownerAddress).add(1000), 0));

    const balance = fromBytes(call(address, "balanceOf", new Args().add(ownerAddress), 0));
    // const totalSupply = fromBytes(call(address, "totalSupply", new Args(), 0));
    // const name = fromBytes(call(address, "name", new Args(), 0));
    // const symbol = fromBytes(call(address, "symbol", new Args(), 0));
    // We log an event to display the number
    // generateEvent(`Name: ${name}, symbol: ${symbol}, totalSupply: ${totalSupply}, `);
    generateEvent(`balance: ${balance}`);
}
