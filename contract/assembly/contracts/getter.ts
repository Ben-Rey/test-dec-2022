import { Address, Args, call, fromBytes, generateEvent } from "@massalabs/massa-as-sdk";

// Function used to test the get_value fonction
export function main(): void {
    // First we provide the address of the increment contract
    const address = new Address("A1oGyyH19AcYMM3NE3DW17cGUyPWpF8eCNotPos5zAQNvjYaqAE"); // testnet
    // const address = new Address("A1XKLLDnRyRFsYLhfSsdubsiTSFpswTETvhXyTu7VcYzzBb9QLP"); // local
    // Then we call the function get_value which return the last sotred number
    const result = fromBytes(call(address, "get_value", new Args(), 1000));
    // We log an event to display the number
    generateEvent(`Value from smart contract = ${result}`);
}
