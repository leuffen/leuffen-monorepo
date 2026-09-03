export function createDialogClientSource(
  navigateOnChange: boolean,
  debug: boolean,
  sessionId: string,
): string {
  return `
const AUTO_NAVIGATE_KEY = "vite-jekyll-hmr-manager:auto-navigate";
const HIDE_NOTICES_KEY = "vite-jekyll-hmr-manager:hide-notices";
const SESSION_ID_KEY = "vite-jekyll-hmr-manager:session-id";
const currentSessionId = ${JSON.stringify(sessionId)};

if (sessionStorage.getItem(SESSION_ID_KEY) !== currentSessionId) {
  sessionStorage.removeItem(AUTO_NAVIGATE_KEY);
  sessionStorage.removeItem(HIDE_NOTICES_KEY);
  sessionStorage.setItem(SESSION_ID_KEY, currentSessionId);
}

class ViteJekyllHmrDialog extends HTMLElement {
  targetUrl = "/";

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.innerHTML = \`
      <style>
        :host { position: fixed; inset: 0; z-index: 2147483647; display: grid; place-items: center; pointer-events: none; }
        dialog { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: min(28rem, calc(100vw - 2rem)); margin: 0; padding: 0; pointer-events: auto; border: 0; border-radius: .75rem; color: #17202a; background: #fff; box-shadow: 0 .75rem 3rem #0003; font: 14px/1.45 system-ui,sans-serif; }
        .content { padding: 1rem 1.1rem; }
        h2 { margin: 0 0 .35rem; font-size: 1rem; }
        p { margin: 0 0 .85rem; color: #4b5563; }
        a { color: #075985; font-weight: 600; }
        .actions { display: flex; flex-wrap: wrap; gap: .5rem; }
        button { border: 0; border-radius: .4rem; padding: .5rem .7rem; cursor: pointer; font: inherit; }
        .primary { color: #fff; background: #075985; }
        .secondary { color: #334155; background: #e2e8f0; }
        label { display: block; margin-top: .8rem; color: #475569; font-size: .8rem; }
        input { margin-right: .4rem; }
      </style>
      <dialog>
        <div class="content">
          <h2>Aktualisierung auf anderer Seite</h2>
          <p>Eine andere Seite wurde aktualisiert: <a data-link></a></p>
          <div class="actions">
            <button class="primary" data-switch>Jetzt wechseln</button>
            <button class="secondary" data-close>Später</button>
          </div>
          <label><input type="checkbox" data-auto>Automatisch zu aktualisierten Seiten wechseln</label>
          <label><input type="checkbox" data-hide>Nicht wieder anzeigen</label>
        </div>
      </dialog>\`;

    const dialog = shadow.querySelector("dialog");
    const link = shadow.querySelector("[data-link]");
    const auto = shadow.querySelector("[data-auto]");
    const hide = shadow.querySelector("[data-hide]");

    shadow.querySelector("[data-switch]").addEventListener("click", () => {
      window.location.href = this.targetUrl;
    });
    shadow.querySelector("[data-close]").addEventListener("click", () => dialog.close());
    auto.addEventListener("change", () => {
      sessionStorage.setItem(AUTO_NAVIGATE_KEY, String(auto.checked));
    });
    hide.addEventListener("change", () => {
      sessionStorage.setItem(HIDE_NOTICES_KEY, String(hide.checked));
      if (hide.checked) dialog.close();
    });
  }

  showDialog(url) {
    if (sessionStorage.getItem(HIDE_NOTICES_KEY) === "true") return;
    if (sessionStorage.getItem(AUTO_NAVIGATE_KEY) === "true") {
      window.location.href = url;
      return;
    }
    this.targetUrl = url;
    const dialog = this.shadowRoot.querySelector("dialog");
    const link = this.shadowRoot.querySelector("[data-link]");
    const auto = this.shadowRoot.querySelector("[data-auto]");
    const hide = this.shadowRoot.querySelector("[data-hide]");
    link.href = url;
    link.textContent = url;
    auto.checked = sessionStorage.getItem(AUTO_NAVIGATE_KEY) === "true";
    hide.checked = sessionStorage.getItem(HIDE_NOTICES_KEY) === "true";
    if (!dialog.open) dialog.showModal();
  }
}

if (!customElements.get("vite-jekyll-hmr-dialog")) {
  customElements.define("vite-jekyll-hmr-dialog", ViteJekyllHmrDialog);
}

const hot = import.meta.hot;
if (hot) {
  hot.on("vite-jekyll-hmr-manager:page-changed", ({ url, file, sessionId }) => {
    const current = decodeURI(window.location.pathname).replace(/\\/$/, "") || "/";
    const changed = url.replace(/\\/$/, "") || "/";
    ${debug ? `console.log("[vite-jekyll-hmr-manager] change detected", { changedFile: file, changedPage: url, currentPage: window.location.pathname, currentPageAffected: current === changed, sessionId });` : ""}
    if (current !== changed) {
      if (${JSON.stringify(navigateOnChange)}) {
        window.location.href = url;
        return;
      }
      let dialog = document.querySelector("vite-jekyll-hmr-dialog");
      if (!dialog) {
        dialog = document.createElement("vite-jekyll-hmr-dialog");
        document.body.appendChild(dialog);
      }
      dialog.showDialog(url);
    }
  });
}
`;
}
