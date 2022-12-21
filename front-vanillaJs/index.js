let massa = window.massa;
let Args = massa.Args;
let client = null;

const SMART_CONTRACT_ADDRESS =
  "A1oGyyH19AcYMM3NE3DW17cGUyPWpF8eCNotPos5zAQNvjYaqAE";

const baseAccount = {
  address: "A12Lkz8mEZ4uXPrzW9WDo5HKWRoYgeYjiQZMrwbjE6cPeRxuSfAG",
  secretKey: "S1273BfFRp7B2ELtMLG4yibtad3QHgRTjJrNdD8LDUjS9mB2wQJM",
  publicKey: "P12LfRbXubSwU8uaCCxgSwBEN7k66VrVXvuczGz2RJcrbA7xtt9o",
};

massa.ClientFactory.createDefaultClient(
  massa.DefaultProviderUrls.TESTNET,
  false,
  baseAccount
).then((c) => (client = c));

function increment(number) {
  if (isLoading()) return;

  let args = new Args();
  args.addI32(BigInt(number));
  if (client) {
    client
      .smartContracts()
      .callSmartContract(
        {
          fee: 0,
          maxGas: 200000,
          coins: 0,
          simulatedGasPrice: 0,
          targetAddress: SMART_CONTRACT_ADDRESS,
          functionName: "increment",
          parameter: args.serialize(),
          callerAddress: baseAccount.address,
        },
        baseAccount
      )
      .then((res) => {
        const incrementOperationId = localStorage.getItem(
          "incrementOperationId"
        );
        if (res[0] !== incrementOperationId) {
          localStorage.setItem("incrementOperationId", incrementOperationId);
          setButtonLoading();
        }
      });
  }
}

function getValue() {
  if (client) {
    client
      .smartContracts()
      .readSmartContract({
        fee: 0,
        maxGas: 200000,
        simulatedGasPrice: 0,
        targetAddress: SMART_CONTRACT_ADDRESS,
        targetFunction: "get_value",
        parameter: new Args().serialize(),
        callerAddress: baseAccount.address,
      })
      .then((res) => {
        if (res[0]?.output_events[0]?.data) {
          if (getNumValue() !== res[0].output_events[0].data) {
            setButtonLoadingEnd();
          }
          updateNumValue(res[0].output_events[0].data);
          updateNumLoader();
        }
      });
  }
}

function updateNumValue(num) {
  const numDiv = document.getElementById("num");
  numDiv.innerText = num;
}

function updateNumLoader() {
  document.getElementById("num-loader").style.display = "none";
  document.getElementById("num").style.display = "block";
}

function getNumValue() {
  return document.getElementById("num").textContent;
}

function setButtonLoading() {
  document.getElementById("increment").style.display = "none";
  document.getElementById("increment-load").style.display = "flex";
}

function setButtonLoadingEnd() {
  document.getElementById("increment").style.display = "flex";
  document.getElementById("increment-load").style.display = "none";
}

function isLoading() {
  return document.getElementById("increment-load").style.display === "block";
}

const interval = setInterval(() => getValue(), 1000);
