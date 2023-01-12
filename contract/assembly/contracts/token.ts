import { Address, Args, Context, fromBytes, generateEvent, Storage, toBytes } from "@massalabs/massa-as-sdk";

export const NAME = toBytes("name");
export const SYMBOL = toBytes("symbol");
export const DECIMALS = toBytes("decimals");
export const TOTAL_SUPPLY = toBytes("totalSupply");
export const INITIALIZED = toBytes("INITIALIZED");
const TRANSFER_EVENT_NAME = "TRANSFER";
const APPROVAL_EVENT_NAME = "APPROVAL";

export function init(_args: StaticArray<u8>): void {
    const args = new Args(_args);

    const name = toBytes(args.nextString());
    Storage.set(NAME, name);

    const symbol = toBytes(args.nextString());
    Storage.set(SYMBOL, symbol);

    const decimals = toBytes(args.nextU32().toString());
    Storage.set(DECIMALS, decimals);

    const totalSupply = args.nextU32();
    Storage.set(TOTAL_SUPPLY, toBytes(totalSupply.toString()));

    const ownerAddress = Context.caller();

    _setBalance(ownerAddress, totalSupply);
}

// Getters
export function name(_args: StaticArray<u8>): StaticArray<u8> {
    return Storage.get(NAME);
}

export function symbol(_args: StaticArray<u8>): StaticArray<u8> {
    return Storage.get(SYMBOL);
}

export function decimals(_args: StaticArray<u8>): StaticArray<u8> {
    return Storage.get(DECIMALS);
}

export function totalSupply(_args: StaticArray<u8>): StaticArray<u8> {
    return Storage.get(TOTAL_SUPPLY);
}

/* -------------------------------------------------------------------------- */
/*                                    Event                                   */
/* -------------------------------------------------------------------------- */

/**
 * Constructs an event given a key and arguments
 *
 * @param {string} key - event key
 * @param {Array} args - array of string arguments.
 * @return {string} stringified event.
 */
export function createEvent(key: string, args: Array<string>): string {
    return `${key}:`.concat(args.join(","));
}

/* -------------------------------------------------------------------------- */
/*                                  Ballance                                  */
/* -------------------------------------------------------------------------- */

function _balance(address: Address): u64 {
    const balance = Storage.has(toBytes(address.toByteString()))
        ? fromBytes(Storage.get(toBytes(address.toByteString())))
        : "0";

    return u64(parseInt(balance));
}

/**
 * Returns the balance of the specified address
 *
 * @param {string} stringifyArgs - Args object serialized as a string containing:
 * - the specified account (address)
 *
 * @return {u64} - balance of the specified address
 */
export function balanceOf(_args: StaticArray<u8>): string {
    const args = new Args(_args);
    const address = args.nextAddress();
    const balance = _balance(address);
    generateEvent(`${balance.toString()}`);
    return balance.toString();
}

/**
 * Sets the balance of a given address.
 *
 * @param {Address} address - address to set the balance for
 * @param {u64} balance
 *
 */
function _setBalance(address: Address, balance: u64): void {
    Storage.set(toBytes(address.toByteString()), toBytes(balance.toString()));
}

/* -------------------------------------------------------------------------- */
/*                                  ALLOWANCE                                 */
/* -------------------------------------------------------------------------- */

/**
 * Returns the allowance set on the owner's account for the spender.
 *
 * @param {Address} ownerAddress - owner's id
 * @param {Address} spenderAddress - spender's id
 *
 * @return {u64} the allowance
 */
function _allowance(ownerAddress: Address, spenderAddress: Address): u64 {
    const key = ownerAddress.toByteString().concat(spenderAddress.toByteString());
    const allow = Storage.has(toBytes(key)) ? fromBytes(Storage.get(toBytes(key))) : "0";

    return u64(parseInt(allow, 10));
}

/**
 * Sets the allowance of the spender on the owner's account.
 *
 * @param {Address} ownerAddress - owner address
 * @param {Address} spenderAddress - spender address
 * @param {u64} amount - amount to set an allowance for
 *
 */
function _approve(ownerAddress: Address, spenderAddress: Address, amount: u64): void {
    Storage.set(toBytes(ownerAddress.toByteString().concat(spenderAddress.toByteString())), toBytes(amount.toString()));
}

/**
 * Increases the allowance of the spender on the owner's account by the amount.
 *
 * This function can only be called by the owner.
 *
 * @param {string} stringifyArgs - Args object serialized as a string containing:
 * - the spender's account (address);
 * - the amount (u64).
 *
 * @return {string} - boolean value ("1" or "0")
 */
export function increaseAllowance(stringifyArgs: StaticArray<u8>): string {
    const ownerAddress = Context.caller();

    const args = new Args(stringifyArgs);
    const spenderAddress = args.nextAddress();
    const amount = args.nextU64();

    if (!spenderAddress.isValid() || isNaN(amount)) {
        return "0";
    }

    const newAllowance = _allowance(ownerAddress, spenderAddress) + amount;

    if (newAllowance < amount) {
        return "0"; // would result in an overflow
    }

    _approve(ownerAddress, spenderAddress, newAllowance);

    const event = createEvent(APPROVAL_EVENT_NAME, [
        ownerAddress.toByteString(),
        spenderAddress.toByteString(),
        newAllowance.toString(),
    ]);

    generateEvent(event);

    return "1";
}

/**
 * Decreases the allowance of the spender the on owner's account by the amount.
 *
 * This function can only be called by the owner.
 *
 * @param {string} stringifyArgs - Args object serialized as a string containing:
 * - the spender's account (address);
 * - the amount (u64).
 *
 * @return {string} - boolean value ("1" or "0")
 */
export function decreaseAllowance(stringifyArgs: StaticArray<u8>): string {
    const ownerAddress = Context.caller();

    const args = new Args(stringifyArgs);
    const spenderAddress = args.nextAddress();
    const amount = args.nextU64();

    if (!spenderAddress.isValid() || isNaN(amount)) {
        return "0";
    }

    const current = _allowance(ownerAddress, spenderAddress);

    if (current < amount) {
        return "0"; // underflow
    }

    const newAllowance = current - amount;

    _approve(ownerAddress, spenderAddress, newAllowance);

    const event = createEvent(APPROVAL_EVENT_NAME, [
        ownerAddress.toByteString(),
        spenderAddress.toByteString(),
        newAllowance.toString(),
    ]);
    generateEvent(event);

    return "1";
}

/* -------------------------------------------------------------------------- */
/*                                  Transfer                                  */
/* -------------------------------------------------------------------------- */

/**
 * Transfers tokens from the caller's account to the recipient's account.
 *
 * @param {Address} from - sender address
 * @param {Address} to - recipient address
 * @param {u64} amount - number of token to transfer
 *
 * @return {bool}
 */
function _transfer(from: Address, to: Address, amount: u64): bool {
    const currentFromBalance = _balance(from);
    const currentToBalance = _balance(to);
    const newTobalance = currentToBalance + amount;

    if (
        currentFromBalance < amount || // underflow of balance from
        newTobalance < currentToBalance
    ) {
        // overflow of balance to
        return false;
    }

    _setBalance(from, currentFromBalance - amount);
    _setBalance(to, newTobalance);

    return true;
}

/**
 * Transfers tokens from the caller's account to the recipient's account.
 *
 * @param {string} stringifyArgs - Args object serialized as a string containing:
 * - the recipient's account (address)
 * - the number of tokens (u64).
 *
 * @return {string} - boolean value ("1" or "0")
 */
export function transfer(stringifyArgs: StaticArray<u8>): string {
    const ownerAddress = Context.caller();

    const args = new Args(stringifyArgs);
    const toAddress = args.nextAddress();
    const amount = args.nextU32();

    if (!toAddress.isValid() || isNaN(amount)) {
        return "0";
    }

    if (!_transfer(ownerAddress, toAddress, amount)) {
        return "2";
    }

    const event = createEvent(TRANSFER_EVENT_NAME, [
        ownerAddress.toByteString(),
        toAddress.toByteString(),
        amount.toString(),
    ]);
    generateEvent(event);

    return "1";
}

/**
 * Transfers token ownership from the owner's account to the recipient's account
 * using the spender's allowance.
 *
 * This function can only be called by the spender.
 * This function is atomic:
 * - both allowance and transfer are executed if possible;
 * - or if allowance or transfer is not possible, both are discarded.
 *
 * @param {string} stringifyArgs - Args object serialized as a string containing:
 * - the owner's account (address);
 * - the recipient's account (address);
 * - the amount (u64).
 *
 * @return {string} - boolean value ("1" or "0")
 */
export function transferFrom(stringifyArgs: StaticArray<u8>): string {
    const spenderAddress = Context.caller();

    const args = new Args(stringifyArgs);
    const ownerAddress = args.nextAddress();
    const recipientAddress = args.nextAddress();
    const amount = args.nextU32();

    if (!ownerAddress.isValid() || !recipientAddress.isValid() || isNaN(amount)) {
        return "0";
    }

    const spenderAllowance = _allowance(ownerAddress, spenderAddress);

    if (spenderAllowance < amount) {
        return "2";
    }

    if (!_transfer(ownerAddress, recipientAddress, amount)) {
        return "3";
    }

    _approve(ownerAddress, spenderAddress, spenderAllowance - amount);

    const event = createEvent(TRANSFER_EVENT_NAME, [
        ownerAddress.toByteString(),
        recipientAddress.toByteString(),
        amount.toString(),
    ]);
    generateEvent(event);

    return "1";
}
