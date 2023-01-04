import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ReactGA from "react-ga";
import "virtual:windi.css";
import "./styles.css";

ReactGA.initialize("G-85RZBGK3H5");
ReactGA.pageview(window.location.pathname + window.location.search);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
