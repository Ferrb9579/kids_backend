// src/controllers/notification.controller.js
import { validationResult } from 'express-validator';
import { wss } from '../server.js';  // Import the wss or some reference to your WS server
// If you stored connected clients in a separate module, import them instead

export const sendNotification = async (req, res) => {
    // Validate using express-validator if needed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation error',
            errors: errors.array(),
        });
    }

    const { title, message } = req.body;

    try {
        // Create a notification payload
        const payload = JSON.stringify({
            title,
            message,
            timestamp: new Date().toISOString(),
        });

        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
            // Ensure the client is open before sending
            if (client.readyState === 1) {
                client.send(payload);
            }
        });

        return res.status(200).json({
            success: true,
            message: 'Notification broadcasted successfully.',
        });
    } catch (error) {
        console.error('Error broadcasting notification:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to broadcast notification.',
        });
    }
};
