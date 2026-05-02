import express from 'express';
import { getWeatherData, getSoilData } from '../services/weatherService.js';
import { formatResponse } from '../utils/errorHandler.js';

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

    // Get location string
    const locationString = typeof location === 'string' 
      ? location 
      : `Lat: ${location.lat}, Long: ${location.long}`;

    // Call weather and soil services (no API quota consumed)
    const weather = await getWeatherData(locationString);
    const soil = await getSoilData(locationString);

    const response = {
      location: locationString,
      weather: weather,
      soil: soil,
      timestamp: new Date().toISOString()
    };

    console.log('✅ Location data sent successfully');
    res.json(formatResponse(true, response));

  } catch (error) {
    console.error('❌ Location route error:', error);
    res.status(500).json(
      formatResponse(false, null, {
        code: 'SERVER_ERROR',
        message: 'Failed to get location data'
      })
    );
  }
});

export default router;
