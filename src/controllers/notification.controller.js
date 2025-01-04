// src/controllers/notification.controller.js
import { wss } from '../server.js';

export const sendNotification = async (req, res) => {
    const { title, message } = req.body;

    try {
        const payload = JSON.stringify({
            title,
            message,
            timestamp: new Date().toISOString(),
        });

        wss.clients.forEach((client) => {
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
