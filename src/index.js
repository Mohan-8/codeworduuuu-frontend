import React from "react";
import ReactDOM from "react-dom/client"; // ✅ Correct import for React 18
import CodewordApp from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CodewordApp />
  </React.StrictMode>
);
