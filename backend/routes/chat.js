import express from 'express';
import { sendChatMessage } from '../services/geminiService.js';
import { parseError, retryAsync, formatResponse } from '../utils/errorHandler.js';

const router = express.Router();

/**
 * POST /api/chat
 * Send a chat message to Gemini with optional image
 * 
 * Body: {
 *   message: string (required)
 *   image: string (base64, optional)
 *   language: string (default: "English")
 *   contextData: object (optional)
 * }
 */
router.post('/', async (req, res) => {
  try {
    const {
      message,
      image,
      language = 'English',
      contextData = {}
    } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json(
        formatResponse(false, null, {
          code: 'INVALID_REQUEST',
          message: 'Message is required and must be a string'
        })
      );
    }

    console.log(`📨 Chat request received: "${message.substring(0, 50)}..."`);

    // Call Gemini with retry logic
    const response = await retryAsync(
      () => sendChatMessage(message, image, language, contextData),
      2,  // max retries
      1000 // initial delay
    );

    console.log('✅ Chat response sent successfully');
    res.json(formatResponse(true, response));

  } catch (error) {
    console.error('❌ Chat route error:', error);
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
