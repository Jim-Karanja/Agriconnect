const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Notification text is required'], // Adding validation error message
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'], // Adding validation error message
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Follow naming conventions: Use singular and capitalized model name
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
