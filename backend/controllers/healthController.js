'use strict';

/**
 * GET /api/health
 * Simple liveness probe endpoint.
 * Returns server status, uptime, and version — no auth required.
 */
async function getHealth(req, res) {
  return res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      version: '1.0.0',
      uptime: Math.round(process.uptime() * 10) / 10, // seconds, one decimal
      timestamp: new Date().toISOString(),
    },
  });
}

module.exports = { getHealth };
