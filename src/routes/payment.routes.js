import { Router } from "express";
import { cashfreeWebhook } from "../controllers/payment.controller.js";
import express from "express"

const paymentRouter = Router();

paymentRouter.get("/return", (req, res) => {
    console.log("FULL QUERY:", req.query);
    const { order_id } = req.query;

    res.send(`<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Piggy Bank - Payment Status</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      :root {
        --primary: #facc15;
        --primary-glow: #fde047;
        --secondary: #fbbf24;
        --accent: #f97316;
        --dark: #0f0f1a;
        --darker: #070710;
        --card: rgba(255, 255, 255, 0.04);
        --border: rgba(255, 255, 255, 0.08);
        --text: #ffffff;
        --text-muted: #94a3b8;
      }
    /* NAV BAR HOVER EFFECTS */
.logo {
  cursor: pointer;
  transition: all 0.4s ease;
}

.logo:hover {
  transform: scale(1.05);
  filter: brightness(1.2);
}

.logo-icon {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.logo:hover .logo-icon {
  transform: rotate(15deg) scale(1.15);
  box-shadow: 0 0 25px rgba(250, 204, 21, 0.5);
}

      body {
        font-family: "Inter", sans-serif;
        background: radial-gradient(circle at top, #0a0a14 0%, #070710 60%, #05050a 100%);
        color: var(--text);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: 1.2rem 3rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 100;
        background: rgba(7, 7, 16, 0.4);
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        border-bottom: 1px solid var(--border);
      }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 1.4rem;
        font-weight: 700;
        background: linear-gradient(135deg, var(--primary), var(--secondary));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .logo-icon {
        width: 38px;
        height: 38px;
        border-radius: 12px;
        background: linear-gradient(135deg, var(--primary), var(--accent));
        display: flex;
        align-items: center;
        justify-content: center;
        color: #111827;
      }

      .logo-icon svg {
        width: 22px;
        height: 22px;
      }

      .container {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 7rem 1.5rem 3rem;
      }

      .card {
        max-width: 480px;
        width: 100%;
        background: var(--card);
        border-radius: 24px;
        border: 1px solid var(--border);
        padding: 2.5rem 2.25rem;
        box-shadow:
          0 24px 40px rgba(0, 0, 0, 0.6),
          0 0 80px rgba(250, 204, 21, 0.25);
        position: relative;
        overflow: hidden;
      }
        /* CARD HOVER EFFECT */
.card {
  transition: all 0.4s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.card:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: rgba(250, 204, 21, 0.4);
  box-shadow:
    0 35px 60px rgba(0, 0, 0, 0.7),
    0 0 110px rgba(250, 204, 21, 0.3);
}

.card:hover::before {
  opacity: 1;
  background: radial-gradient(
    circle at top,
    rgba(250, 204, 21, 0.25),
    transparent 60%
  );
}
.status-icon {
  animation: pulseSuccess 1.8s infinite ease-in-out;
}

@keyframes pulseSuccess {
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.2); }
  70% { transform: scale(1.08); box-shadow: 0 0 20px 10px rgba(34, 197, 94, 0); }
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}

      .card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top, rgba(250, 204, 21, 0.14), transparent 60%);
        opacity: 0.9;
        pointer-events: none;
      }

      .card-inner {
        position: relative;
        z-index: 1;
      }

      .status-icon {
        width: 64px;
        height: 64px;
        border-radius: 999px;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid rgba(34, 197, 94, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
      }

      .status-icon svg {
        width: 34px;
        height: 34px;
        stroke: #22c55e;
      }

      .title {
        text-align: center;
        font-size: 1.8rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }

      .subtitle {
        text-align: center;
        font-size: 0.98rem;
        color: var(--text-muted);
        margin-bottom: 2rem;
      }

      .info-block {
        background: rgba(15, 23, 42, 0.7);
        border-radius: 16px;
        padding: 1.25rem 1rem;
        border: 1px solid rgba(148, 163, 184, 0.4);
        margin-bottom: 1.5rem;
        font-size: 0.95rem;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.4rem;
      }

      .info-label {
        color: var(--text-muted);
      }

      .info-value {
        font-weight: 600;
      }

      .order-id {
        font-family: "Inter", monospace;
        font-size: 0.9rem;
        padding: 0.35rem 0.6rem;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.9);
        border: 1px solid rgba(148, 163, 184, 0.5);
        display: inline-block;
        margin-top: 0.3rem;
        word-break: break-all;
      }

      .note {
        font-size: 0.85rem;
        color: var(--text-muted);
        text-align: center;
        margin-bottom: 1.75rem;
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }

      .btn-primary, .btn-ghost {
        width: 100%;
        padding: 0.85rem 1.25rem;
        border-radius: 999px;
        font-size: 0.95rem;
        font-weight: 600;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        text-decoration: none;
      }

      .btn-primary {
        background: linear-gradient(135deg, var(--primary), var(--accent));
        color: #111827;
      }

      .btn-ghost {
        background: transparent;
        border: 1px solid rgba(148, 163, 184, 0.7);
        color: var(--text-muted);
      }

      .btn-primary:hover {
        filter: brightness(1.1);
        transform: translateY(-1px);
      }

      .btn-ghost:hover {
        border-color: rgba(248, 250, 252, 0.85);
        color: #e5e7eb;
      }

      .footer {
        text-align: center;
        padding: 1.5rem 0 1rem;
        font-size: 0.8rem;
        color: var(--text-muted);
      }

      @media (max-width: 640px) {
        .header {
          padding: 1rem 1.25rem;
        }
        .card {
          padding: 2rem 1.5rem;
        }
      }
    </style>
  </head>
  <body>
    <header class="header">
      <div class="logo">
        <div class="logo-icon">
          <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fxemoji" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#FFA1E0" d="M440.978 323.425c3.819-14.914 5.852-30.544 5.852-46.649c0-103.524-83.926-187.46-187.46-187.46c-22.642 0-44.346 4.014-64.439 11.37c-39.597-53.207-108.116-71.15-117.883-62.258c-13.158 11.98-32.999 74.787-5.471 141.8c3.49 8.496 8.713 16.362 15.139 23.411c-9.532 22.473-14.806 47.189-14.806 73.136c0 16.106 2.033 31.735 5.852 46.649c-6.345 11.508-9.789 23.817-9.789 36.614c0 63.903 49.429 115.707 191.397 115.707s191.397-51.804 191.397-115.707c0-12.796-3.444-25.106-9.789-36.613z"></path><path fill="#FFC7EF" d="M259.37 299.192c-80.334 0-99.93 33.493-99.93 74.808c0 41.316 19.596 74.808 99.93 74.808S359.3 415.316 359.3 374c0-41.315-19.595-74.808-99.93-74.808z"></path><path fill="#E583C9" d="M228.347 366.537c0 14.532-7.888 26.312-17.617 26.312s-17.617-11.78-17.617-26.312s7.888-26.312 17.617-26.312s17.617 11.78 17.617 26.312zm79.664-26.312c-9.73 0-17.617 11.78-17.617 26.312s7.888 26.312 17.617 26.312s17.617-11.78 17.617-26.312s-7.888-26.312-17.617-26.312z"></path><path fill="#2B3B47" d="M376.812 230.085V271.805c0 13.985-11.337 25.321-25.321 25.321s-25.321-11.337-25.321-25.321V230.085c0-13.985 11.337-25.321 25.321-25.321s25.321 11.336 25.321 25.321zM167.25 204.763c-13.985 0-25.321 11.337-25.321 25.321V271.804c0 13.985 11.337 25.321 25.321 25.321s25.321-11.337 25.321-25.321v-41.719c0-13.985-11.337-25.322-25.321-25.322zm43.48 144.092c-9.73 0-17.617 11.78-17.617 26.312s7.888 26.312 17.617 26.312s17.617-11.78 17.617-26.312s-7.887-26.312-17.617-26.312zm97.281 0c-9.73 0-17.617 11.78-17.617 26.312s7.888 26.312 17.617 26.312s17.617-11.78 17.617-26.312s-7.888-26.312-17.617-26.312z"></path><path fill="#E583C9" d="M93.158 182.158c-20.737-50.48-9.529-93.588.383-102.612c6.398-5.825 46.27 3.638 76.174 32.563c-31.392 17.129-57.338 42.974-74.602 74.281a57.871 57.871 0 0 1-1.955-4.232zm335.801 14.663c12.297-13.871 28.025-49.209 38.205-68.102c0 0-30.307-15.857-66.709-46.109c-18.014-14.971-27.164-24.931-63.187 23.616c40.232 18.406 72.814 50.628 91.691 90.595z"></path><path fill="#FFA1E0" d="M359.3 81.64c71.309-5.37 65.299 64.754 65.628 88.668c0 0 52.798-6.458 53.367-28.893S422.704 19.681 359.3 81.64z"></path></g></svg>
        </div>
        PIGGY BANK
      </div>
    </header>

    <main class="container">
      <div class="card">
        <div class="card-inner">
          <div class="status-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 12.75L11.25 15 15 9.75" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>

          <h1 class="title">Payment Successful</h1>
          <p class="subtitle">Your deposit has been received securely. You can safely close this tab.</p>

          <div class="info-block">
            <div class="info-row">
              <span class="info-label">Status</span>
              <span class="info-value">Success</span>
            </div>
            <div class="info-row">
              <span class="info-label">Order ID</span>
              <span class="info-value">
                <span class="order-id">${order_id}</span>
              </span>
            </div>
          </div>

          <p class="note">
            It may take a few seconds for your goal balance to reflect this payment in the app.
          </p>

         
        </div>
      </div>
    </main>

    <footer class="footer">
      © ${new Date().getFullYear()} Piggy Bank • Secure Payments with Cashfree
    </footer>
  </body>
  </html>`);
});


paymentRouter.post("/webhook", express.json(), cashfreeWebhook)

export default paymentRouter