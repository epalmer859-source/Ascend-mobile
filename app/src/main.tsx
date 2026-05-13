import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) throw new Error('Root element with id="root" not found');

function showError(el: HTMLElement, msg: string) {
  el.innerHTML = `<div style="padding:40px;max-width:600px;margin:0 auto;font-family:sans-serif;background:#000;color:#fff;min-height:100vh;">
    <h1 style="color:#E2CDB9;">Failed to load</h1>
    <pre style="background:#1a1a1a;padding:16px;border-radius:8px;overflow:auto;font-size:14px;white-space:pre-wrap;">${msg.replace(/</g, "&lt;")}</pre>
    <p style="color:#888;margin-top:16px;">Check the browser console (F12) for more details.</p>
  </div>`;
}

try {
  createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : "";
  showError(rootEl, message + (stack ? "\n\n" + stack : ""));
  console.error(err);
}
