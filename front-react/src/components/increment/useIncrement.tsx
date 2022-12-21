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
  SMART_CONTRACT_ADDRESS,
  BASE_ACCOUNT_ADDRESS,
} from "../../global/constants";
import useAsyncEffect from "../../utils/asyncEffect";

interface useIncrementReturn {
  increment: Function;
  fetchNumber: Function;
  loading: boolean;
  num: string | null;
}

// The purpose of this hooks is just to separate the logic from the ui and have cleaner components
export function useIncrement(): useIncrementReturn {
  const [web3Client, setWeb3Client] = useState<Client | null>(null);
  const [baseAccount, setBaseAccount] = useState<IAccount | null>();
  const [incrementOperationId, setIncrementOperationId] = useState<string>("");

  const [num, setNum] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useAsyncEffect(async () => {
    try {
      const baseAccount: IAccount = await WalletClient.getAccountFromSecretKey(
        BASE_ACCOUNT_SECRET_KEY
      );
      setBaseAccount(baseAccount);
      const web3Client = await ClientFactory.createDefaultClient(
        // local: "http://127.0.0.1:33032",
        DefaultProviderUrls.TESTNET,
        false,
        baseAccount
      );

      setWeb3Client(web3Client);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const fetchNumber = useCallback(async () => {
    let args = new Args();
    if (web3Client) {
      const readTxData = await web3Client.smartContracts().readSmartContract({
        fee: 0,
        maxGas: 200000,
        simulatedGasPrice: 0,
        targetAddress: SMART_CONTRACT_ADDRESS,
        targetFunction: "get_value",
        parameter: args.serialize(),
        callerAddress: BASE_ACCOUNT_ADDRESS,
      } as IReadData);

      if (readTxData[0]?.output_events[0]?.data) {
        if (num !== readTxData[0].output_events[0].data) {
          setLoading(false);
        }
        setNum((_) => readTxData[0].output_events[0].data);
      }
    }
  }, [web3Client, num]);

  useEffect(() => {
    const interval = setInterval(() => fetchNumber(), 1000);
    return () => clearInterval(interval);
  }, [fetchNumber]);

  const increment = async (num: number) => {
    if (loading) return;

    let args = new Args();
    args.addI32(BigInt(num));

    if (web3Client) {
      const readTxData = await web3Client.smartContracts().callSmartContract(
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

      if (readTxData[0] !== incrementOperationId) {
        setIncrementOperationId(readTxData[0]);
        setLoading(true);
      }
    }
  };

  return {
    increment,
    fetchNumber,
    loading,
    num,
  };
}
