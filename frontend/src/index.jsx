import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App.jsx";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);