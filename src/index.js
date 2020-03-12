import fetch from 'node-fetch';
import AbortController from 'abort-controller';

const baseUrl = 'https://api.github.com';
const defaultUserAgent = 'is-github';
const defaultTimeout = 5000;
const services = ['hooks', 'web', 'api', 'git', 'pages', 'importer'];
const maxAgeRegex = /max\-age=(\d+)/;

let metaResponseCache = null;

async function getMeta({ timeout, userAgent }) {
  if (metaResponseCache && Date.now() < metaResponseCache.expires) {
    return metaResponseCache.resJson;
  }

  const abortController = new AbortController();

  let timer;
  if (timeout) {
    timer = setTimeout(() => controller.abort(), timeout);
  }
  const clearTimer = () => timer && clearTimeout(timer);

  let res;
  try {
    res = await fetch(`${baseUrl}/meta`, {
      signal: abortController.signal,
      headers: { 'User-Agent': userAgent }
    });
  } catch (e) {
    clearTimer();
    throw e;
  }
  clearTimer();

  if (res.status !== 200) {
    throw new Error(`Invalid status: ${res.status}`);
  }

  const resJson = await res.json();

  const cacheHeader = res.headers.get('cache-control');
  if (cacheHeader) {
    const parts = maxAgeRegex.exec(cacheHeader);
    if (parts.length) {
      metaResponseCache = { resJson, expires: Date.now() + parts[1] * 1000 };
    }
  }

  return resJson;
}

// https://tech.mybuilder.com/determining-if-an-ipv4-address-is-within-a-cidr-range-in-javascript/
function ip4ToInt(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4) {
    throw new Error('Error converting IP to int.');
  }
  try {
    return parts.reduce((int, oct) => (int << 8) + parseInt(oct, 10), 0) >>> 0;
  } catch (e) {
    throw new Error('Error converting IP to int.');
  }
}

function isIp4InCidr(ip, cidr) {
  try {
    const [range, bits = 32] = cidr.split('/');
    const mask = ~(2 ** (32 - bits) - 1);
    return (ip4ToInt(ip) & mask) === (ip4ToInt(range) & mask);
  } catch (e) {
    throw new Error('Error checking IP.');
  }
}

export async function isGitHub(
  ipAddress,
  {
    service = 'hooks',
    timeout = defaultTimeout,
    userAgent = defaultUserAgent
  } = {}
) {
  if (!ipAddress) {
    throw new Error('IP address missing.');
  }
  if (services.indexOf(service) === -1) {
    throw new Error(`Unknown service: ${service}`);
  }
  const meta = await getMeta({ timeout, userAgent });
  const addresses = meta[service];
  return addresses.some(cidr => isIp4InCidr(ipAddress, cidr));
}
