import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-less/semantic.less";
import "./index.css";
import { AppRouter } from "./views/routes";

// import { worker } from "./views/routes/pageHome/__testMocks__";
// worker.start();
ReactDOM.render(<AppRouter />, document.getElementById("root"));
