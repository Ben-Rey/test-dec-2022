import { INCREMENT_NUMBER } from "../../global/constants";

import LoaderNumer from "../loader-number/loader-number";
import Loader from "../loader/Loader";
import "./balance.css";
import { useToken } from "./useToken";

const Balance = () => {
  const { balance, approve } = useToken();
  return (
    <div className="balance-layout">
      <div className="balance-content">
        My balance {parseInt(balance) * 10 ** -2} INC
        <button className="balance-approve-button">Approve</button>
      </div>
    </div>
  );
};

export default Balance;
