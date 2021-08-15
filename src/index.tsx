import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import App from "./App";
import "./index.scss";

Modal.setAppElement("#modal");

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
