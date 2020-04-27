import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-less/semantic.less";
import "./index.css";
import { AppRouter } from "./views/routes";

ReactDOM.render(<AppRouter />, document.getElementById("root"));
