/* ===============================
   GLOBAL TOAST SYSTEM – PiggyBank
   =============================== */

/* 1️⃣ Ensure toast root exists */
(function ensureToastRoot() {
  function createRoot() {
    if (!document.getElementById("app-toast-root")) {
      const root = document.createElement("div");
      root.id = "app-toast-root";
      document.body.appendChild(root);
    }
  }

  if (document.body) {
    createRoot();
  } else {
    document.addEventListener("DOMContentLoaded", createRoot);
  }
})();


/* 2️⃣ Inject base styles (once) */
(function injectToastStyles() {
  if (document.getElementById("toast-styles")) return;

  const style = document.createElement("style");
  style.id = "toast-styles";
  style.innerHTML = `
    #app-toast-root {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      pointer-events: none;
    }

    .toast {
      min-width: 280px;
      max-width: 360px;
      padding: 14px 16px;
      border-radius: 12px;
      background: rgba(15, 15, 15, 0.92);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.12);
      color: #fff;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 0.9rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      animation: toast-slide-in 0.35s ease forwards;
      pointer-events: auto;
    }

    .toast.hide {
      animation: toast-slide-out 0.25s ease forwards;
    }

    .toast-icon {
      font-size: 1.2rem;
      flex-shrink: 0;
    }

    .toast-message {
      flex: 1;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: #aaa;
      font-size: 1.2rem;
      cursor: none;
      padding: 0;
      transition: color 0.2s ease;
    }

    .toast-close:hover {
      color: #fff;
    }

    /* Toast variants */
    .toast-success {
      border-left: 4px solid #22c55e;
    }

    .toast-error {
      border-left: 4px solid #ef4444;
    }

    .toast-warning {
      border-left: 4px solid #facc15;
    }

    .toast-info {
      border-left: 4px solid #3b82f6;
    }

    /* Animations */
    @keyframes toast-slide-in {
      from {
        opacity: 0;
        transform: translateX(40px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes toast-slide-out {
      from {
        opacity: 1;
        transform: translateX(0);
      }
      to {
        opacity: 0;
        transform: translateX(40px);
      }
    }

    /* Mobile */
    @media (max-width: 600px) {
      #app-toast-root {
        left: 50%;
        right: auto;
        transform: translateX(-50%);
        top: 16px;
      }

      .toast {
        max-width: calc(100vw - 32px);
      }
    }
  `;
  document.head.appendChild(style);
})();

/* 3️⃣ Toast creator */
function showToast(message, type = "info", duration = 3500) {
  const root = document.getElementById("app-toast-root");
  if (!root) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  const icons = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || "ℹ️"}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Close">&times;</button>
  `;

  root.appendChild(toast);

  /* Close handler */
  const close = () => {
    toast.classList.add("hide");
    setTimeout(() => toast.remove(), 250);
  };

  toast.querySelector(".toast-close").addEventListener("click", close);

  /* Auto dismiss */
  if (duration > 0) {
    setTimeout(close, duration);
  }
}

/* 4️⃣ Helper shortcuts */
window.toast = {
  success: msg => showToast(msg, "success"),
  error: msg => showToast(msg, "error"),
  warning: msg => showToast(msg, "warning"),
  info: msg => showToast(msg, "info")
};
