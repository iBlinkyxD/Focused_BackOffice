import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider";
import { I18nextProvider } from "react-i18next";
import i18n from "./services/i18n.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </AuthProvider>
  </React.StrictMode>
);
