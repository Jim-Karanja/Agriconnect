const axios = require('axios');
const crypto = require('crypto');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.passkey = process.env.MPESA_PASSKEY;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox';
    
    // API URLs
    this.baseURL = this.environment === 'production' 
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
      
    this.accessTokenURL = `${this.baseURL}/oauth/v1/generate?grant_type=client_credentials`;
    this.stkPushURL = `${this.baseURL}/mpesa/stkpush/v1/processrequest`;
    this.queryURL = `${this.baseURL}/mpesa/stkpushquery/v1/query`;
  }

  // Generate OAuth access token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(this.accessTokenURL, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        }
      });
      
      return response.data.access_token;
    } catch (error) {
      console.error('Error getting access token:', error.response?.data || error.message);
      throw new Error('Failed to get M-Pesa access token');
    }
  }

  // Generate password for STK push
  generatePassword() {
    const timestamp = this.getTimestamp();
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  // Get current timestamp in the required format
  getTimestamp() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hour}${minute}${second}`;
  }

  // Initiate STK Push
  async initiateSTKPush(phoneNumber, amount, reference, description) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      
      // Format phone number - ensure it starts with 254
      let formattedPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
      }

      const requestData = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount), // M-Pesa requires integer amounts
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: reference || 'AgriConnect',
        TransactionDesc: description || 'AgriConnect Platform Payment'
      };

      const response = await axios.post(this.stkPushURL, requestData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        checkoutRequestID: response.data.CheckoutRequestID,
        merchantRequestID: response.data.MerchantRequestID,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        customerMessage: response.data.CustomerMessage
      };

    } catch (error) {
      console.error('STK Push error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || 'Payment initiation failed',
        code: error.response?.data?.errorCode || 'UNKNOWN_ERROR'
      };
    }
  }

  // Query STK Push status
  async querySTKPushStatus(checkoutRequestID) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const requestData = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID
      };

      const response = await axios.post(this.queryURL, requestData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return {
        success: true,
        responseCode: response.data.ResponseCode,
        responseDescription: response.data.ResponseDescription,
        merchantRequestID: response.data.MerchantRequestID,
        checkoutRequestID: response.data.CheckoutRequestID,
        resultCode: response.data.ResultCode,
        resultDesc: response.data.ResultDesc
      };

    } catch (error) {
      console.error('STK Push query error:', error.response?.data || error.message);
      
      return {
        success: false,
        error: error.response?.data?.errorMessage || 'Status query failed',
        code: error.response?.data?.errorCode || 'UNKNOWN_ERROR'
      };
    }
  }

  // Validate callback data
  validateCallback(callbackData) {
    try {
      const body = callbackData.Body;
      const resultCode = body.stkCallback.ResultCode;
      const resultDesc = body.stkCallback.ResultDesc;
      const merchantRequestID = body.stkCallback.MerchantRequestID;
      const checkoutRequestID = body.stkCallback.CheckoutRequestID;
      
      let transactionData = {
        merchantRequestID,
        checkoutRequestID,
        resultCode,
        resultDesc,
        success: resultCode === 0
      };

      // If payment was successful, extract transaction details
      if (resultCode === 0 && body.stkCallback.CallbackMetadata) {
        const metadata = body.stkCallback.CallbackMetadata.Item;
        
        metadata.forEach(item => {
          switch (item.Name) {
            case 'Amount':
              transactionData.amount = item.Value;
              break;
            case 'MpesaReceiptNumber':
              transactionData.mpesaReceiptNumber = item.Value;
              break;
            case 'Balance':
              transactionData.balance = item.Value;
              break;
            case 'TransactionDate':
              transactionData.transactionDate = item.Value;
              break;
            case 'PhoneNumber':
              transactionData.phoneNumber = item.Value;
              break;
          }
        });
      }

      return transactionData;
    } catch (error) {
      console.error('Callback validation error:', error);
      return null;
    }
  }
}

module.exports = MpesaService;
