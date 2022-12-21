import React from "react";
import "./App.css";
import Increment from "./components/increment/increment";
import massa from "./logo.webp";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={massa} className="App-logo" alt="logo" />
      </header>
      <Increment />
    </div>
  );
};

export default App;
