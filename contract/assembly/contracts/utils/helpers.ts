import { Address, Storage, toBytes, fromBytes, Context } from "@massalabs/massa-as-sdk";
import { UINT32_MAX, OWNER_ADDRESS_KEY, INITIALIZED_KEY } from "./constants";

export function add(a: u32, b: u32): u32 {
    return a + b;
}

export function _assertNoOverflow(a: u32, b: u32): boolean {
    if (a > UINT32_MAX - b) {
        return false;
    }
    return true;
}

/**
 * Returns if the an Address is a  owner or not. Returns true if no  ower is yet set
 * @param {Address} caller - Caller to be compared with the  owner in storage.
 * @return {bool}
 */
export function _assertOwner(caller: Address): bool {
    if (!Storage.has(toBytes(OWNER_ADDRESS_KEY))) {
        return true; // no owner set yet
    }

    // else - owner is set, check if it equals the caller
    const Owner = Address.fromByteString(fromBytes(Storage.get(toBytes(OWNER_ADDRESS_KEY))));
    if (Owner.equals(caller)) {
        return true;
    }

    // owner is not the caller
    return false;
}

/**
 * Returns if the an the counter has been initialized
 * @return {bool}
 */
export function _assertInitialized(): bool {
    if (!Storage.has(toBytes(INITIALIZED_KEY))) {
        return true;
    }
    return false;
}

/**
 * Sets the  owner address
 * @param {string} _args - ?
 */
export function addOwnerAddress(_args: string): void {
    // check that the caller is the  owner.
    // For initial calls, there is no owner and the check will pass
    assert(_assertOwner(Context.caller()));
    Storage.set(toBytes(OWNER_ADDRESS_KEY), toBytes(Context.caller().toByteString()));
}
