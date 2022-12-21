import { Address, Args, call } from "@massalabs/massa-as-sdk";

export function main(): void {
    // const address = new Address("A1vB5Z1ZdaAoBgr3Ya5BH9WCMGBPLRwezGtg4NkH7FF9Y3rpgHA"); // testnet
    const address = new Address("A1oGyyH19AcYMM3NE3DW17cGUyPWpF8eCNotPos5zAQNvjYaqAE"); // local
    call(address, "init", new Args(), 1000);
}
