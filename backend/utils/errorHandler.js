// Error codes mapping
export const ERROR_CODES = {
  API_KEY_MISSING: 'API_KEY_MISSING',
  RATE_LIMIT: 'RATE_LIMIT',
  TIMEOUT: 'TIMEOUT',
  INVALID_IMAGE: 'INVALID_IMAGE',
  INVALID_REQUEST: 'INVALID_REQUEST',
  SERVER_ERROR: 'SERVER_ERROR'
};

// Parse error and extract code
export const parseError = (error) => {
  const message = error?.message || String(error);
  
  if (message.includes('429') || message.includes('RESOURCE_EXHAUSTED')) {
    return {
      code: ERROR_CODES.RATE_LIMIT,
      statusCode: 429,
      message: '⚠️ API quota exceeded. Server is busy. Please try again in a few moments.',
      retriable: true
    };
  }
  
  if (message.includes('API_KEY') || message.includes('UNAUTHENTICATED') || message.includes('not configured')) {
    return {
      code: ERROR_CODES.API_KEY_MISSING,
      statusCode: 500,
      message: '❌ BACKEND ERROR: GEMINI_API_KEY is not configured.\n\nTo fix: Go to Railway → Backend service → Variables tab → Add GEMINI_API_KEY with your actual Google AI API key.',
      retriable: false
    };
  }
  
  if (message.includes('timeout') || message.includes('Timeout')) {
    return {
      code: ERROR_CODES.TIMEOUT,
      statusCode: 504,
      message: '⏱️ Request took too long. Please try again.',
      retriable: true
    };
  }
  
  if (message.includes('Invalid image')) {
    return {
      code: ERROR_CODES.INVALID_IMAGE,
      statusCode: 400,
      message: 'Invalid image format. Please upload a valid image (JPG, PNG, etc.)',
      retriable: false
    };
  }
  
  return {
    code: ERROR_CODES.SERVER_ERROR,
    statusCode: 500,
    message: `❌ Error: ${message.substring(0, 100)}`,
    retriable: true
  };
};

// Async retry logic
export const retryAsync = async (fn, maxRetries = 2, delayMs = 1000) => {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const parsedError = parseError(error);
      
      console.log(`Attempt ${attempt}/${maxRetries + 1} failed:`, parsedError.message);
      
      // Don't retry if not retriable
      if (!parsedError.retriable) {
        throw error;
      }
      
      // Don't retry on last attempt
      if (attempt > maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      const waitTime = delayMs * Math.pow(2, attempt - 1); // Exponential backoff
      console.log(`Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
};

// Response formatter
export const formatResponse = (success, data, error = null) => {
  return {
    success,
    data: data || null,
    error: error || null,
    timestamp: new Date().toISOString()
  };
};

// Rate limit checker
export const checkRateLimit = (error) => {
  const parsedError = parseError(error);
  return parsedError.code === ERROR_CODES.RATE_LIMIT;
};
