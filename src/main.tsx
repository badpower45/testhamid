
  // Prevent third-party scripts from throwing when attempting to define a custom
  // element more than once (e.g. webcomponent polyfills or editor plugins).
  // This monkey-patches the browser API early so any later attempts to re-define
  // an element simply get ignored instead of throwing and breaking the entire app.
  if (typeof window !== "undefined" && typeof (window as any).customElements !== "undefined") {
    try {
      const nativeDefine = (window as any).customElements.define.bind(
        (window as any).customElements,
      );
      (window as any).customElements.define = (
        name: string,
        constructor: CustomElementConstructor,
        options?: ElementDefinitionOptions,
      ) => {
        if ((window as any).customElements.get(name)) {
          // element already defined — ignore duplicate registration
          // eslint-disable-next-line no-console
          console.warn(`Custom element '${name}' already defined — skipping re-definition.`);
          return;
        }
        return nativeDefine(name, constructor, options as any);
      };
    } catch (e) {
      // If monkey-patching fails for any reason, continue — the error overlay will
      // still capture runtime exceptions but we prefer not to crash here.
      // eslint-disable-next-line no-console
      console.warn("Failed to patch customElements.define:", e);
    }
  }

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
  