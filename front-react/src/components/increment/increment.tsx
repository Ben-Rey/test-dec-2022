import { INCREMENT_NUMBER } from "../../global/constants";
import { useIncrement } from "./useIncrement";
import LoaderNumer from "../loader-number/loader-number";
import Loader from "../loader/Loader";
import "./increment.css";

const Increment = () => {
  const { increment, loading, num } = useIncrement();
  return (
    <div className="increment-layout">
      <div className="increment-container">
        <span className="increment-title">Increment smart-contract</span>
        {num ? (
          <span className="increment-number-value">{num}</span>
        ) : (
          <LoaderNumer />
        )}
        <div className="increment-button-wrapper">
          <button
            className={`increment-number-button ${loading && "disabled"}`}
            onClick={() => increment(INCREMENT_NUMBER)}
          >
            {loading ? <Loader /> : "Increment by 2"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Increment;
