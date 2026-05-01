/**
 * Frontend API Client Service
 * Communicates with backend proxy instead of Gemini API directly
 */

// Smart backend URL detection for different environments
function getBackendURL(): string {
  // 1. If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // 2. Default to production backend for Railway, or localhost for development
  // In production, Railway will set VITE_API_URL environment variable
  // If not set, default to production backend URL
  return 'https://radiant-renewal-production.up.railway.app';
}

const BACKEND_URL = getBackendURL();

// Log backend URL for debugging
if (typeof window !== 'undefined') {
  console.log('✅ Backend API URL:', BACKEND_URL);
  if (BACKEND_URL.includes('railway.app')) {
    console.log('🚀 Production backend connected');
  } else if (BACKEND_URL.includes('localhost')) {
    console.log('🔧 Development backend connected');
  }
}

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    retriable?: boolean;
  } | null;
  timestamp: string;
}

interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
}

/**
 * Retry logic for failed requests
 */
async function retryFetch<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxRetries = 2, delayMs = 1000 } = options;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      const errorMsg = lastError.message || '';
      
      console.warn(`❌ Attempt ${attempt}/${maxRetries + 1} failed:`, errorMsg);
      
      // Add helpful debugging info
      if (errorMsg.includes('Failed to fetch') || errorMsg.includes('Network')) {
        console.error(`🔌 Connection Error - Backend not reachable at: ${BACKEND_URL}`);
        console.error('📝 Make sure:', [
          '1. Backend is running (npm start in backend folder)',
          '2. VITE_API_URL environment variable is correct',
          '3. CORS is enabled on backend',
          '4. Backend and frontend can communicate'
        ].join('\n   '));
      }

      // Check if error is retriable
      const isRetriable = isRetriableError(lastError);
      if (!isRetriable || attempt > maxRetries) {
        throw error;
      }

      // Exponential backoff
      const waitTime = delayMs * Math.pow(2, attempt - 1);
      console.log(`⏳ Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError || new Error('Request failed');
}

/**
 * Check if an error should be retried
 */
function isRetriableError(error: Error): boolean {
  const message = error.message || '';
  
  // Rate limit errors are retriable
  if (message.includes('429') || message.includes('RATE_LIMIT')) {
    return true;
  }
  
  // Timeout errors are retriable
  if (message.includes('timeout') || message.includes('504')) {
    return true;
  }
  
  // Network errors are retriable
  if (message.includes('network') || message.includes('fetch')) {
    return true;
  }
  
  return false;
}

/**
 * Send chat message to backend
 */
export async function sendChatToBackend(
  message: string,
  imageBase64?: string,
  language: string = 'English',
  contextData: any = {}
): Promise<string> {
  return retryFetch(
    async () => {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          image: imageBase64,
          language,
          contextData
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        
        if (response.status === 429) {
          throw new Error('429: Server busy - API quota exceeded. Please try again later.');
        }
        
        if (response.status === 503 || response.status === 502) {
          throw new Error('Backend service unavailable. Is the backend server running?');
        }
        
        throw new Error(errorMessage);
      }

      const data: ApiResponse<any> = await response.json();
      
      if (!data.success || !data.data?.message) {
        throw new Error(data.error?.message || 'Failed to get response from backend');
      }

      return data.data.message;
    },
    { maxRetries: 2, delayMs: 1000 }
  );
}

/**
 * Analyze crop image via backend
 */
export async function analyzeCropViaBackend(
  imageBase64: string,
  language: string = 'English',
  contextData: any = {}
): Promise<any> {
  return retryFetch(
    async () => {
      const response = await fetch(`${BACKEND_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageBase64,
          language,
          contextData
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        
        if (response.status === 429) {
          throw new Error('429: Server busy - API quota exceeded. Please try again later.');
        }
        
        throw new Error(errorMessage);
      }

      const data: ApiResponse<any> = await response.json();
      
      if (!data.success || !data.data?.analysis) {
        throw new Error(data.error?.message || 'Failed to analyze image');
      }

      return data.data.analysis;
    },
    { maxRetries: 2, delayMs: 1000 }
  );
}

/**
 * Get location context data via backend
 */
export async function getLocationDataViaBackend(
  location: string | { lat: number; long: number }
): Promise<any> {
  return retryFetch(
    async () => {
      const response = await fetch(`${BACKEND_URL}/api/location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ location })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      const data: ApiResponse<any> = await response.json();
      
      if (!data.data) {
        throw new Error(data.error?.message || 'Failed to get location data');
      }

      return data.data.data;
    },
    { maxRetries: 1, delayMs: 500 }
  );
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET'
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
}
