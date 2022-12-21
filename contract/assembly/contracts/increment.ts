import { Address, Args, call } from "@massalabs/massa-as-sdk";

export function main(): void {
    // const address = new Address("A1vB5Z1ZdaAoBgr3Ya5BH9WCMGBPLRwezGtg4NkH7FF9Y3rpgHA"); // testnet
    const address = new Address("A1oGyyH19AcYMM3NE3DW17cGUyPWpF8eCNotPos5zAQNvjYaqAE"); // local
    // call(address, "increment", new Args().add(4294967295), 1000);
    call(address, "increment", new Args().add(2), 1000);
}
