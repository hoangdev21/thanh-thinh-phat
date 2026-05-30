import * as http from 'http';
import * as https from 'https';

const DEFAULT_INTERVAL_MS = 240000;
const MIN_INTERVAL_MS = 60000;
const DEFAULT_INITIAL_DELAY_MS = 15000;
const DEFAULT_TIMEOUT_MS = 8000;

type KeepAliveOptions = {
  url?: string;
  intervalMs?: number;
  initialDelayMs?: number;
  timeoutMs?: number;
};

const resolveIntervalMs = (intervalMs?: number) => {
  if (!Number.isFinite(intervalMs) || (intervalMs ?? 0) < MIN_INTERVAL_MS) {
    return DEFAULT_INTERVAL_MS;
  }

  return intervalMs as number;
};

const pingKeepAlive = (url: string, timeoutMs: number) => {
  try {
    const target = new URL(url);
    const isHttps = target.protocol === 'https:';

    if (target.protocol !== 'http:' && !isHttps) {
      console.warn(`Keep-alive URL must use http or https: ${url}`);
      return;
    }

    const transport = isHttps ? https : http;
    const port = target.port ? parseInt(target.port, 10) : isHttps ? 443 : 80;

    const request = transport.request(
      {
        method: 'GET',
        hostname: target.hostname,
        port,
        path: `${target.pathname}${target.search}`,
        timeout: timeoutMs,
        headers: {
          'User-Agent': 'keep-alive',
        },
      },
      (response) => {
        response.resume();
      }
    );

    request.on('error', (error) => {
      console.warn(`Keep-alive ping failed: ${error.message}`);
    });

    request.on('timeout', () => {
      request.destroy(new Error('Keep-alive timeout'));
    });

    request.end();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`Keep-alive URL is invalid: ${message}`);
  }
};

export const startKeepAlive = (options: KeepAliveOptions = {}) => {
  const url = options.url ?? process.env.KEEP_ALIVE_URL?.trim();

  if (!url) {
    return;
  }

  const rawIntervalMs =
    options.intervalMs ?? parseInt(process.env.KEEP_ALIVE_INTERVAL_MS || '', 10);
  const intervalMs = resolveIntervalMs(rawIntervalMs);
  const initialDelayMs = options.initialDelayMs ?? DEFAULT_INITIAL_DELAY_MS;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  console.log(`Keep-alive enabled: ${url} every ${Math.round(intervalMs / 1000)}s`);

  setTimeout(() => {
    pingKeepAlive(url, timeoutMs);
    setInterval(() => pingKeepAlive(url, timeoutMs), intervalMs);
  }, initialDelayMs);
};
