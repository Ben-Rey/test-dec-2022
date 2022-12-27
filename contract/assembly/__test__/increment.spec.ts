// Test only owner
// Test only Is init
// Test overflow
// Test Ingrement
// Test get Value

import { init, increment, get_value } from "../contracts/main";
import { Args, fromBytes } from "@massalabs/massa-as-sdk";

const OWNER_ADDRESS = "S1273BfFRp7B2ELtMLG4yibtad3QHgRTjJrNdD8LDUjS9mB2wQJM";
const USER_ADDRESS = "S1bXjyPwrssNmG4oUG5SEqaUhQkVArQi7rzQDWpCprTSmEgZDGG";
const NUM_TO_ADD = 3;
const INITIAL_COUNTER_VAlUE = 0;

describe("Increment Function", (): i32 => {
    test("Should Init Counter to 0", (): i32 => {
        init([]);
        const num = parseInt(fromBytes(get_value([])));
        if (assertNumIsEqual(num, INITIAL_COUNTER_VAlUE)) return TestResult.Success;
        else return TestResult.Failure;
    });
    test("Should succed if Counter incremented by a number", (): i32 => {
        init([]);
        increment(new Args().add(NUM_TO_ADD).serialize());
        const num = parseInt(fromBytes(get_value([])));
        if (assertNumIsEqual(num, NUM_TO_ADD)) return TestResult.Success;
        else return TestResult.Failure;
    });
    return TestResult.Success;
});

function assertNumIsEqual(num: f64, equalTo: f64): boolean {
    // error(num.toString() + ", " + equalTo.toString() + " was expected.");
    if (num !== equalTo) {
        error(`FAILURE :: Num should be equal to ${equalTo} => num is equal to ${num}`);
        return false;
    }
    return true;
}
