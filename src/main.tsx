import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import './i18n/config';

// Set initial direction based on saved language preference
const savedLang = localStorage.getItem('i18nextLng') || 'fa';
document.documentElement.lang = savedLang;
document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
