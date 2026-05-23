/**
 * ============================================================================
 * HOME PAGE VIEW
 * ============================================================================
 *
 * Styled HTML landing page for the backend root URL.
 * Provides quick links to Swagger docs and health check.
 */

interface HomePageProps {
  nodeEnv: string;
  nodeVersion: string;
  startedAtStr: string;
  uptime: string;
}

export function getHomePage({ nodeEnv, nodeVersion, startedAtStr, uptime }: HomePageProps): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hotel Reservation API</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root{
      --bg: radial-gradient(1200px 600px at 10% -10%, #0d9488 0%, transparent 60%),
            radial-gradient(1000px 500px at 110% 10%, #0891b2 0%, transparent 60%),
            #0f172a;
      --card:#1e293b;
      --muted:#94a3b8;
      --text:#e2e8f0;
      --accent:#2dd4bf;
      --primary:#14b8a6;
      --ok:#22c55e;
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;
      font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;
      background:var(--bg);
      color:var(--text);
      display:flex;align-items:center;justify-content:center;
      padding:24px;
    }
    .wrap{max-width:980px;width:100%}
    .hero{
      background:linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));
      border:1px solid rgba(255,255,255,0.08);
      border-radius:24px;
      padding:36px 28px;
      box-shadow:0 10px 30px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(255,255,255,0.04);
      backdrop-filter: blur(8px);
    }
    .title{display:flex;gap:12px;align-items:center;margin:0 0 8px}
    .badge{
      font-size:12px;letter-spacing:.4px;text-transform:uppercase;
      color:#0f172a;background:linear-gradient(90deg,#5eead4,#22d3ee);
      padding:6px 10px;border-radius:999px;font-weight:700;
    }
    h1{font-size:40px;line-height:1.1;margin:10px 0 6px}
    p.lead{color:var(--muted);margin:0 0 22px;font-size:16px}
    .grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}
    .card{
      grid-column:span 4;
      background:var(--card);
      border:1px solid rgba(255,255,255,0.08);
      border-radius:18px;padding:18px;
    }
    .card h3{margin:0 0 6px;font-size:14px;color:var(--muted);font-weight:600;letter-spacing:.3px}
    .value{font-size:18px;font-weight:700}
    .actions{display:flex;gap:12px;margin-top:22px;flex-wrap:wrap}
    .btn{
      appearance:none;border:0;cursor:pointer;
      padding:12px 16px;border-radius:14px;font-weight:700;text-decoration:none;display:inline-flex;align-items:center;gap:8px;
      transition:transform .12s ease, box-shadow .12s ease, opacity .12s ease;
    }
    .btn:hover{transform:translateY(-1px)}
    .btn-primary{
      color:white;background:linear-gradient(90deg,var(--primary),#0d9488);
      box-shadow:0 8px 20px rgba(20,184,166,.35);
    }
    .btn-ghost{
      color:var(--text);background:rgba(255,255,255,0.06);
      border:1px solid rgba(255,255,255,0.1);
    }
    .footer{margin-top:18px;color:var(--muted);font-size:12px;text-align:center}
    .ok{color:var(--ok);font-weight:800}
    @media (max-width:900px){
      .card{grid-column:span 6}
    }
    @media (max-width:600px){
      h1{font-size:30px}
      .card{grid-column:span 12}
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <div class="title"><span class="badge">Hotel Reservation API</span></div>
      <h1>Intelligent Room Booking</h1>
      <p class="lead">Backend is live. Explore the API docs, health checks, and try out the room allocation algorithm below.</p>

      <div class="grid">
        <div class="card"><h3>Status</h3><div class="value"><span class="ok">&#9679;</span> Running</div></div>
        <div class="card"><h3>Environment</h3><div class="value">${nodeEnv}</div></div>
        <div class="card"><h3>Node</h3><div class="value">${nodeVersion}</div></div>
        <div class="card"><h3>Started</h3><div class="value">${startedAtStr}</div></div>
        <div class="card"><h3>Uptime</h3><div class="value" id="uptime">${uptime}</div></div>
        <div class="card"><h3>Rooms</h3><div class="value">97 (10 floors)</div></div>
      </div>

      <div class="actions">
        <a class="btn btn-primary" target="_blank" href="/api-docs">API Docs</a>
        <a class="btn btn-ghost" target="_blank" href="/api/health">Health Check</a>
        <a class="btn btn-ghost" target="_blank" href="/api/v1/rooms">All Rooms</a>
      </div>
      <div class="footer">Hotel Room Reservation System &mdash; SDE 3 Assessment</div>
    </section>
  </main>
  <script>
    const startTime = ${Date.now() - (parseInt(uptime) || 0) * 1000};
    const el = document.getElementById('uptime');
    function fmt(ms){const s=Math.floor(ms/1000);const h=String(Math.floor(s/3600)).padStart(2,'0');const m=String(Math.floor((s%3600)/60)).padStart(2,'0');const sec=String(s%60).padStart(2,'0');return h+':'+m+':'+sec;}
    function tick(){el.textContent = fmt(Date.now() - startTime);}
    tick();setInterval(tick,1000);
  </script>
</body>
</html>`;
}
