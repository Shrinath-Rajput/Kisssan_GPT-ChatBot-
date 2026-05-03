/**
 * FIXED API CLIENT (FOR RAILWAY)
 */

function getBackendURL(): string {
  // ALWAYS use Railway backend URL in production
  return import.meta.env.VITE_API_URL || 'https://radiant-renewal-production.up.railway.app';
}

const BACKEND_URL = getBackendURL();

function getAPIUrl(path: string): string {
  return `${BACKEND_URL}${path}`;
}

// ================= CHAT =================
export async function sendChatToBackend(
  message: string,
  imageBase64?: string,
  language: string = 'English',
  contextData: any = {}
): Promise<string> {

  const response = await fetch(getAPIUrl('/api/chat'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      image: imageBase64,
      language,
      contextData
    })
  });

  const data = await response.json();
  return data.data.message;
}

// ================= ANALYZE =================
export async function analyzeCropViaBackend(
  imageBase64: string,
  language: string = 'English',
  contextData: any = {}
): Promise<any> {

  const response = await fetch(getAPIUrl('/api/analyze'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: imageBase64,
      language,
      contextData
    })
  });

  const data = await response.json();
  return data.data.analysis;
}

// ================= LOCATION =================
export async function getLocationDataViaBackend(location: any) {

  const response = await fetch(getAPIUrl('/api/location'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ location })
  });

  const data = await response.json();
  return data.data;
}

// ================= HEALTH =================
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(getAPIUrl('/health'));
    return res.ok;
  } catch {
    return false;
  }
}