import { generateEvent, Args, toBytes, Storage, fromBytes, Context } from "@massalabs/massa-as-sdk";
import { INITIALIZED_KEY, OWNER_ADDRESS_KEY } from "./utils/constants";
import { addOwnerAddress, _assertInitialized, _assertNoOverflow, _assertOwner } from "./utils/helpers";

/**
 * Initialize the counter - Can only be called by the owner
 *
 * @param {StaticArray<u8>} serializedArgs - Empty
 */
export function init(serializedArgs: StaticArray<u8>): void {
    // Store owner address if not already stored
    if (!Storage.has(toBytes(OWNER_ADDRESS_KEY))) addOwnerAddress(Context.caller().toByteString());
    // Check if the owner is the one who call the function
    assert(_assertOwner(Context.caller()), "Only Owner allowed");
    // Store the first value of the counter - 0
    Storage.set(toBytes("number"), toBytes("0"));
    // Store a new boolean telling that the contract has been initialized
    Storage.set(toBytes(INITIALIZED_KEY), new Args().add(true).serialize());
}

/**
 * Increment stored number by provided value
 *
 * @param {StaticArray<u8>} serializedArgs - Args including the value to add
 *
 * @return {StaticArray<u8>}
 */
export function increment(serializedArgs: StaticArray<u8>): StaticArray<u8> {
    // Check if the contract has been Initialized
    assert(_assertInitialized, "Contract not initialized");
    // Deserialize the args with the Args object
    const args = new Args(serializedArgs);
    // Get the first parameter : an U32
    const to_add_number = args.nextU32();
    // Assign the stored number
    const stored_number = u32(parseInt(fromBytes(Storage.get(toBytes("number")))));
    // Check for overflow
    assert(_assertNoOverflow(stored_number, to_add_number), "Overflow");
    // Add the two numbers
    const result = u32(add(stored_number, to_add_number));
    // Store the result
    Storage.set(toBytes("number"), toBytes(result.toString()));
    // Generate an event
    generateEvent(`New Value = ${result.toString()}`);
    // Return the result
    return [];
}

/**
 * Increment stored number by provided value
 *
 * @param {StaticArray<u8>} serializedArgs - Empty
 *
 * @return {StaticArray<u8>} Stored Number
 */
export function get_value(serializedArgs: StaticArray<u8>): StaticArray<u8> {
    // Check if the contract has been Initialized
    assert(_assertInitialized, "Contract not initialized");
    // Get stored number from store
    const stored_number = Storage.get(toBytes("number"));
    // Return the stored value as StaticArray<u8>
    generateEvent(`${fromBytes(stored_number)}`);
    // Return the stored number
    return stored_number;
}
