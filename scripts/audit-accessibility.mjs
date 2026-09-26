import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const chromePath = process.env.CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const baseUrl = process.env.AUDIT_BASE_URL || "https://corukai.es";
const port = Number(process.env.AUDIT_DEBUG_PORT || 9333);
const profileDir = await mkdtemp(join(tmpdir(), "corukai-a11y-"));
const axeSource = await readFile(join(process.cwd(), "node_modules", "axe-core", "axe.min.js"), "utf8");

const routes = [
  "/",
  "/descubrir",
  "/descubrir?camino=guiado",
  "/descubrir?camino=directo",
  "/tienda",
  "/libros/hacia-rutas-salvajes",
  "/cesta",
  "/cuaderno",
  "/cuaderno/como-elegir-un-libro-sin-mirar-rankings",
  "/aviso-legal",
  "/privacidad",
  "/cookies",
  "/afiliacion",
  "/ruta-que-no-existe-auditoria",
];

const viewports = [
  { name: "phone", width: 390, height: 844, mobile: true },
  { name: "tablet", width: 768, height: 1024, mobile: true },
  { name: "desktop", width: 1366, height: 900, mobile: false },
  { name: "wide", width: 1920, height: 1080, mobile: false },
];

const chrome = spawn(chromePath, [
  "--headless=new",
  "--no-sandbox",
  "--disable-gpu",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`,
  "about:blank",
], { stdio: "ignore" });

async function waitForChrome() {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error("Chrome DevTools no respondió.");
}

function connectCdp(webSocketUrl) {
  const socket = new WebSocket(webSocketUrl);
  const pending = new Map();
  const events = new Map();
  let nextId = 1;

  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      if (message.error) request.reject(new Error(message.error.message));
      else request.resolve(message.result);
      return;
    }
    const listeners = events.get(message.method) || [];
    listeners.splice(0).forEach((resolve) => resolve(message.params));
  });

  const rejectPending = () => {
    for (const request of pending.values()) request.reject(new Error("La pestaña de auditoría se cerró inesperadamente."));
    pending.clear();
  };
  socket.addEventListener("close", rejectPending);
  socket.addEventListener("error", rejectPending);

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  function send(method, params = {}) {
    const id = nextId;
    nextId += 1;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  function once(method) {
    return new Promise((resolve) => {
      const listeners = events.get(method) || [];
      listeners.push(resolve);
      events.set(method, listeners);
    });
  }

  return { socket, ready, send, once };
}

async function auditPage(viewport, route) {
  const url = new URL(route, baseUrl).href;
  const targetResponse = await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" });
  const target = await targetResponse.json();
  const cdp = connectCdp(target.webSocketDebuggerUrl);

  try {
    await cdp.ready;
    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: viewport.mobile,
      screenWidth: viewport.width,
      screenHeight: viewport.height,
    });
    const loaded = cdp.once("Page.loadEventFired");
    await cdp.send("Page.navigate", { url });
    await loaded;
    await new Promise((resolve) => setTimeout(resolve, 350));
    await cdp.send("Runtime.evaluate", { expression: axeSource });

    const result = await cdp.send("Runtime.evaluate", {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const axeResult = await axe.run(document, {
          runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
        });
        const root = document.documentElement;
        const textNodes = [...document.querySelectorAll('body *')].filter((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          const text = (element.textContent || '').trim();
          return text && style.display !== 'none' && style.visibility !== 'hidden' && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
        });
        const tinyText = textNodes.filter((element) => parseFloat(getComputedStyle(element).fontSize) < 12)
          .slice(0, 12)
          .map((element) => ({ selector: element.className || element.tagName.toLowerCase(), text: element.textContent.trim().replace(/\\s+/g, ' ').slice(0, 70), fontSize: getComputedStyle(element).fontSize }));
        return {
          title: document.title,
          url: location.href,
          hasCoruKaiContent: document.body.innerText.includes('CoruKai'),
          viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute('content') || null,
          horizontalOverflow: root.scrollWidth > root.clientWidth + 1,
          documentWidth: root.scrollWidth,
          viewportWidth: root.clientWidth,
          tinyText,
          violations: axeResult.violations.map((violation) => ({
            id: violation.id,
            impact: violation.impact,
            help: violation.help,
            nodes: violation.nodes.length,
            targets: violation.nodes.slice(0, 5).map((node) => node.target.join(' ')),
          })),
        };
      })()`,
    });
    return { viewport: viewport.name, route, ...result.result.value };
  } finally {
    cdp.socket.close();
    await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`).catch(() => undefined);
  }
}

try {
  await waitForChrome();
  const results = [];
  for (const viewport of viewports) {
    for (const route of routes) {
      console.error(`[a11y] ${viewport.name} ${route}`);
      results.push(await auditPage(viewport, route));
    }
  }

  const failures = results.filter((result) => !result.hasCoruKaiContent || result.horizontalOverflow || result.violations.length > 0 || result.tinyText.length > 0);
  console.log(JSON.stringify({
    baseUrl,
    pagesAudited: results.length,
    viewports: viewports.map(({ name, width, height }) => ({ name, width, height })),
    passed: results.length - failures.length,
    failures,
  }, null, 2));
  process.exitCode = failures.length > 0 ? 1 : 0;
} finally {
  chrome.kill();
  await new Promise((resolve) => chrome.once("exit", resolve));
  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      await rm(profileDir, { recursive: true, force: true });
      break;
    } catch (error) {
      if (attempt === 4) throw error;
      await new Promise((resolve) => setTimeout(resolve, 150));
    }
  }
}
