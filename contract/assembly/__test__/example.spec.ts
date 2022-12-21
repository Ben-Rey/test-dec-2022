// Test only owner
// Test only Is init
// Test overflow
// Test Ingrement
// Test get Value

import { init, increment, get_value } from "../contracts/main";
import { Address, Args, fromBytes, Storage, toBytes } from "@massalabs/massa-as-sdk";

const OWNER_ADDRESS = "S1273BfFRp7B2ELtMLG4yibtad3QHgRTjJrNdD8LDUjS9mB2wQJM";
const USER_ADDRESS = "S1bXjyPwrssNmG4oUG5SEqaUhQkVArQi7rzQDWpCprTSmEgZDGG";

describe("Increment Function", (): i32 => {
    test("Should succed if Counter incremented by 2", (): i32 => {
        init([]);
        increment(new Args().add(2).serialize());
        const num = parseInt(fromBytes(get_value([])));
        assert(num === 2, "Wrong number");
        return TestResult.Success;
    });
    return TestResult.Success;
});

// describe("Get Value function", (): i32 => {
//     test("Testing the Storage", (): i32 => {
//         setStorage(new StaticArray<u8>(0));
//         assert(
//             Storage.getOf(new Address("A12E6N5BFAdC2wyiBV6VJjqkWhpz1kLVp2XpbRdSnL1mKjCWT6oR"), toBytes("test")) ==
//                 toBytes("value"),
//             "Test failed",
//         );
//         return TestResult.Success;
//     });

//     return TestResult.Success;
// });
