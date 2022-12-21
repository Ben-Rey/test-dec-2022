import { Args, Client, IAccount, ICallData } from "@massalabs/massa-web3";
import {
  SMART_CONTRACT_ADDRESS,
  BASE_ACCOUNT_ADDRESS,
} from "../global/constants";

export async function call_increment(
  web3Client: Client,
  baseAccount: IAccount,
  args: Args
) {
  web3Client.smartContracts().callSmartContract(
    {
      fee: 0,
      maxGas: 200000,
      coins: 10,
      simulatedGasPrice: 0,
      targetAddress: SMART_CONTRACT_ADDRESS,
      functionName: "increment",
      parameter: args.serialize(),
      callerAddress: BASE_ACCOUNT_ADDRESS,
    } as ICallData,
    baseAccount!
  );
}
