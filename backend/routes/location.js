import express from 'express';
import { getLocationContextData } from '../services/geminiService.js';
import { parseError, formatResponse } from '../utils/errorHandler.js';

const router = express.Router();

/**
 * POST /api/location
 * Get location context data (weather, soil, etc.)
 * 
 * Body: {
 *   location: string OR { lat: number, long: number }
 * }
 */
router.post('/', async (req, res) => {
  try {
    const { location } = req.body;

    // Validation
    if (!location) {
      return res.status(400).json(
        formatResponse(false, null, {
          code: 'INVALID_REQUEST',
          message: 'Location is required (string or {lat, long})'
        })
      );
    }

    console.log(`📍 Location data request:`, location);

    // Call location service
    const response = await getLocationContextData(location);

    console.log('✅ Location data sent successfully');
    res.json(formatResponse(true, response));

  } catch (error) {
    console.error('❌ Location route error:', error);
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
