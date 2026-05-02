import express from 'express';
import { analyzeCropHealthService } from '../services/geminiService.js';
import { parseError, retryAsync, formatResponse } from '../utils/errorHandler.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Analyze crop health from image
 * 
 * Body: {
 *   image: string (base64, required)
 *   language: string (default: "English")
 *   contextData: object (optional)
 * }
 */
router.post('/', async (req, res) => {
  try {
    const {
      image,
      language = 'English',
      contextData = {}
    } = req.body;

    // Validation
    if (!image || typeof image !== 'string') {
      return res.status(400).json(
        formatResponse(false, null, {
          code: 'INVALID_REQUEST',
          message: 'Image is required and must be a base64 string'
        })
      );
    }

    console.log('🔍 Analysis request received for crop health');

    // Call Gemini analysis with retry logic
    // Increase retries for rate limiting issues
    const response = await retryAsync(
      () => analyzeCropHealthService(image, language, contextData),
      4,  // max retries (increased for rate limiting)
      2000 // initial delay (increased)
    );

    console.log('✅ Analysis response sent successfully');
    res.json(formatResponse(true, response));

  } catch (error) {
    console.error('❌ Analyze route error:', error);
    const parsedError = parseError(error);
    
    res.status(parsedError.statusCode).json(
      formatResponse(false, null, {
        code: parsedError.code,
        message: parsedError.message,
        retriable: parsedError.retriable
      })
    );
  }
});

export default router;
