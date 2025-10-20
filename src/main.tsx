
  // NOTE: The early patch to guard against duplicate `customElements.define`
  // is injected as an inline script in `index.html` so it runs before any
  // module script is evaluated. Keeping that logic in `index.html` ensures
  // third-party webcomponents can't break the app before the bundle loads.

  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { ErrorBoundary } from "./ErrorBoundary";


  const rootEl = document.getElementById("root")!;

  function showErrorOverlay(err: any) {
    try {
      const message = err?.message || String(err);
      const stack = err?.stack || "";
      // If React hasn't mounted yet, replace the root content with the error.
      if (rootEl) {
        rootEl.innerHTML = `
          <div style="padding:24px;background:#fff;color:#000;min-height:100vh;font-family:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',Arial;">
            <h1 style="margin-top:0;">حدث خطأ أثناء تحميل الصفحة</h1>
            <p>تفاصيل الخطأ: <strong>${message}</strong></p>
            <pre style="white-space:pre-wrap;margin-top:12px;">${stack}</pre>
            <p>افتح أدوات المطور (Console) لمزيد من المعلومات.</p>
          </div>
        `;
      }
    } catch (e) {
      // ignore failures while trying to show the overlay
      // eslint-disable-next-line no-console
      console.error("Failed to render error overlay", e);
    }
  }

  // Global error handlers to show a visible message instead of a white screen.
  window.addEventListener("error", (event: any) => {
    showErrorOverlay(event.error || event.message || "Unknown error");
  });
  window.addEventListener("unhandledrejection", (event: any) => {
    showErrorOverlay(event.reason || "Unhandled promise rejection");
  });

  createRoot(rootEl).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  