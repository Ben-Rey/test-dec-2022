# Test - Counter dapp

# Smart-contract

## Introduction

Basic application composed of an on-chain smart contract that exhibits an `increment` function that takes an integer as parameter and increments a counter that is stored on chain by that amount.

It also exhibit a function called `get_value` that takes no parameters and returns the current value of the counter.

## Requirements

- NodeJS [https://nodejs.org/en/](https://nodejs.org/en/)
- npm [https://www.npmjs.com/](https://www.npmjs.com/)

## Installation

1. Provide environnement variables in a .env file. for example:

```wasm
WALLET_PRIVATE_KEY="S12L9gmxHhgqmF5PxmkDC9FksPEwtVkk4kJJtdQi3f1RZ1ZZiWU2"
JSON_RPC_URL_PUBLIC=https://test.massa.net/api/v2:33035
JSON_RPC_URL_PRIVATE=https://test.massa.net/api/v2:33034
```

1. Install dependencies

```wasm
npm install
```

1. Build the smart contract

```wasm
npm run build
```

1. Deploy smart contract

```wasm
npm run deploy
```

You can change the value in the .env to deploy it to local, testnet or mainnet

## Testing

```wasm
npm run test
```

## Usage

This smart contract contain 3 main function

1. **init**: initialize the smart contract with a value of 0 and set the owner variable with the address of the user who deployed the contract
2. **increment**: A simple function that takes a number as parameter and adds it to the counter
3. **get_value:** return the value of the counter by emitting an event

# Front

## Introduction

This is the front end application that interact with the smart contract. It displays the counter and allow to increment the counter by 2

## Installation

### locally

1. Provide environnement variables in a .env file. For example:

```wasm
REACT_APP_BASE_ACCOUNT_SECRET_KEY=S12L9qiDIOqsdF5PxakDCLFksPEwtVk31kJJthQi9f1RZ1Z3iWU2
REACT_APP_BASE_ACCOUNT_ADDRESS=A127v9cPbFSHCxhBTuUXYkhHayvkGXY6th3q3NXaiAfmLWi8VNB4
REACT_APP_SMART_CONTRACT_ADDRESS=A1vB5Z1ZdaAoBgr3Ya5BH9WCMGBPLRwezGtg4NkH7FF9Y3rpgHA
```

1. Install dependencies

```wasm
npm install
```

1. Run the application

```wasm
npm run start
```

# Questions

### Question 1

The following AssemblyScript code converts a string `str` into a `StaticArray<u8>`:

```
    let arr = new StaticArray<u8>(str.length << 1);
    memory.copy(changetype<usize>(arr), changetype<usize>(str), arr.length);

```

Explain how this code works. Here is some useful documentation:

- memory layout: [https://www.assemblyscript.org/runtime.html#memory-layout](https://www.assemblyscript.org/runtime.html#memory-layout)
- globals memory: [https://www.assemblyscript.org/stdlib/globals.html#memory](https://www.assemblyscript.org/stdlib/globals.html#memory)

### Answer 1

This piece of code actually come from the massa-as-sdk library. It is the implementation of the toBytes function. The purpose of this code is to take a string and return a StaticArray<u8>

In the first line we create a new array (StaticArray<u8>) and we set the length twice the length of the string to be sure we’ll have enough space (somme characters of the string might take more than 1 byte).

In the second line we copy the content of the string in the array previously created. We will copy the bytes from the memory address of the string (changetype<usize>(str)) to the memory address of the array (changetype<usize>(arr)). The last argument is to specify how many bytes we want to copy. In our case it will be the size of the static array.

### Question 2

Explain this expression in detail: `changetype<string>(__new(123, idof<string>()))`

### Answer 2

This piece of code looks like a part of the fromBytes function in the massa-as-sdk library.

It create a new string object in memory with a bytes size of 123. The `function __new(size: usize, id: u32): usize` takes two parameters.

The size that we need and the class Id of the object. Here we create a string so the class Id must be 2.

The \_\_new function return a `usize` which represent the memory address of the new string so we have to use the function changeType to get a variable of type string.

### Question 3

Explain what an AssemblyScript Transform is.
Here is some documentation: [https://www.assemblyscript.org/compiler.html#transforms](https://www.assemblyscript.org/compiler.html#transforms)

### Answer 3

Transform is a mechanism which allow us to make modification of the code during the compilation process. Before while and after the compilation. It provide 3 hooks `afterParse` `afterInitialize` `afterCompile`. The three hooks allow us to modify the code during 3 steps. It can be useful for example to make optimization or minification.

In this example: [https://github.com/AssemblyScript/examples/blob/main/transform/mytransform.mjs](https://github.com/AssemblyScript/examples/blob/main/transform/mytransform.mjs) found in the

AssemblyScript documentation, Transform is used to log information about the program during the different steps of the compilation
