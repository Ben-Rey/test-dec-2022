import {
  Client,
  IAccount,
  WalletClient,
  ClientFactory,
  DefaultProviderUrls,
  Args,
  IReadData,
  ICallData,
} from "@massalabs/massa-web3";
import { useState, useCallback, useEffect } from "react";
import {
  BASE_ACCOUNT_SECRET_KEY,
  BASE_ACCOUNT_ADDRESS,
  SMART_CONTRACT_TOKEN_ADDRESS,
} from "../../global/constants";
import useAsyncEffect from "../../utils/asyncEffect";

interface useTokenReturn {
  balance: string;
  approve: (num: number) => Promise<void>;
}

// The purpose of this hooks is just to separate the logic from the ui and have cleaner components
export function useToken(): useTokenReturn {
  const [web3Client, setWeb3Client] = useState<Client | null>(null);
  const [baseAccount, setBaseAccount] = useState<IAccount | null>();
  const [balance, setBalance] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useAsyncEffect(async () => {
    try {
      const baseAccount: IAccount = await WalletClient.getAccountFromSecretKey(
        BASE_ACCOUNT_SECRET_KEY
      );
      setBaseAccount(baseAccount);
      const web3Client = await ClientFactory.createDefaultClient(
        "http://127.0.0.1:33032" as DefaultProviderUrls,
        false,
        baseAccount
      );

      setWeb3Client(web3Client);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchBalance = useCallback(async () => {
    let args = new Args();
    if (web3Client) {
      const readTxData = await web3Client.smartContracts().readSmartContract({
        fee: 0,
        maxGas: 200000,
        simulatedGasPrice: 0,
        targetAddress: SMART_CONTRACT_TOKEN_ADDRESS,
        targetFunction: "balanceOf",
        parameter: args.addString(BASE_ACCOUNT_ADDRESS).serialize(),
        callerAddress: BASE_ACCOUNT_ADDRESS,
      } as IReadData);

      if (readTxData[0]?.output_events[0]?.data) {
        if (balance !== readTxData[0].output_events[0].data) {
          setLoading(false);
        }

        setBalance((_) => readTxData[0].output_events[0].data);
      }
    }
  }, [web3Client, balance]);

  const approve = async (num: number) => {
    let args = new Args();
    args.addI32(BigInt(num));

    if (web3Client) {
      const readTxData = await web3Client.smartContracts().callSmartContract(
        {
          fee: 0,
          maxGas: 200000,
          coins: 10,
          simulatedGasPrice: 0,
          targetAddress: SMART_CONTRACT_TOKEN_ADDRESS,
          functionName: "increaseAllowance",
          parameter: args.serialize(),
          callerAddress: BASE_ACCOUNT_ADDRESS,
        } as ICallData,
        baseAccount!
      );

      // if (readTxData[0] !== incrementOperationId) {
      //   setIncrementOperationId(readTxData[0]);
      //   setLoading(true);
      // }
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, approve };
}
