import React from "react";
import "./App.css";
import Balance from "./components/balance/balance";
import Increment from "./components/increment/increment";
import massa from "./logo.webp";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={massa} className="App-logo" alt="logo" />
      </header>
      <div className="App-wrapper">
        <Balance />
        <Increment />
      </div>
    </div>
  );
};

export default App;
