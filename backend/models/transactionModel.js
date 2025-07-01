const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // M-Pesa identifiers
  merchantRequestID: {
    type: String,
    required: true,
    unique: true
  },
  checkoutRequestID: {
    type: String,
    required: true,
    unique: true
  },
  
  // Transaction details
  phoneNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    default: 'AgriConnect Platform Payment'
  },
  
  // Payment status
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled', 'timeout'],
    default: 'pending'
  },
  
  // M-Pesa response data
  mpesaReceiptNumber: {
    type: String,
    default: null
  },
  transactionDate: {
    type: Date,
    default: null
  },
  resultCode: {
    type: String,
    default: null
  },
  resultDescription: {
    type: String,
    default: null
  },
  
  // Internal tracking
  referenceNumber: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    default: null
  },
  
  // Timestamps
  initiatedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date,
    default: null
  },
  
  // Additional metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ phoneNumber: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ merchantRequestID: 1 });
transactionSchema.index({ checkoutRequestID: 1 });

// Virtual for transaction age
transactionSchema.virtual('ageInMinutes').get(function() {
  return Math.floor((Date.now() - this.initiatedAt) / (1000 * 60));
});

// Method to check if transaction is expired (older than 10 minutes)
transactionSchema.methods.isExpired = function() {
  const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
  return this.initiatedAt < tenMinutesAgo && this.status === 'pending';
};

// Method to mark transaction as completed
transactionSchema.methods.markCompleted = function(mpesaData) {
  this.status = 'completed';
  this.completedAt = new Date();
  this.mpesaReceiptNumber = mpesaData.mpesaReceiptNumber;
  this.transactionDate = mpesaData.transactionDate;
  this.resultCode = '0';
  this.resultDescription = 'The service request is processed successfully.';
  return this.save();
};

// Method to mark transaction as failed
transactionSchema.methods.markFailed = function(reason, resultCode = null) {
  this.status = 'failed';
  this.resultCode = resultCode;
  this.resultDescription = reason;
  return this.save();
};

// Static method to find pending transactions
transactionSchema.statics.findPending = function() {
  return this.find({ status: 'pending' });
};

// Static method to find transactions by phone number
transactionSchema.statics.findByPhone = function(phoneNumber) {
  return this.find({ phoneNumber }).sort({ createdAt: -1 });
};

// Static method to find recent transactions
transactionSchema.statics.findRecent = function(limit = 50) {
  return this.find().sort({ createdAt: -1 }).limit(limit);
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
