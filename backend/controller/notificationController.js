/*
Reference: https://git.cs.dal.ca/shah3/group22_tutorly/-/blob/main/backend/src/api/notification/controllers/notification.js
*/
const Notifications = require('../models/notificationModel');

async function getNotifications(req, res) {
    try {
        const notifications = await Notifications.find().sort({ createdAt: -1 });

        res.status(200).json({
            message: `${notifications.length} notifications retrieved successfully.`,
            success: true,
            notification: notifications,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: error.message,
        });
    }
}

async function sendNotifications(req, res) {
    const { text, type } = req.body;

    // Validate input
    if (!text || !type) {
        return res.status(400).json({
            message: 'Notification text and type are required',
            success: false,
        });
    }

    try {
        const notification = await Notifications.create({ text, type });

        res.status(201).json({
            message: 'Notification sent successfully',
            success: true,
            notification,
        });
    } catch (error) {
        console.error("Error sending notification:", error);
        res.status(500).json({
            message: 'Internal server error',
            success: false,
            error: error.message,
        });
    }
}

module.exports = {
    getNotifications,
    sendNotifications,
};
