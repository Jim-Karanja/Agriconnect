// server.js or routes/stkpush.js
const express = require('express');
const axios = require('axios');
const base64 = require('base-64');
const router = express.Router();

const SHORT_CODE = "174379";
const PASSKEY = "bfb279f..."; // Replace with your Daraja Passkey
const CONSUMER_KEY = "your-consumer-key";
const CONSUMER_SECRET = "your-consumer-secret";
const CALLBACK_URL = "https://yourdomain.com/callback";

const getAccessToken = async () => {
    const credentials = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
    const response = await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        headers: { Authorization: `Basic ${credentials}` },
    });
    return response.data.access_token;
};

router.post("/stkpush", async (req, res) => {
    try {
        const { amount, phone, accountReference, description } = req.body;
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
        const password = base64.encode(`${SHORT_CODE}${PASSKEY}${timestamp}`);
        const token = await getAccessToken();

        const stkResponse = await axios.post("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
            BusinessShortCode: SHORT_CODE,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: phone,
            PartyB: SHORT_CODE,
            PhoneNumber: phone,
            CallBackURL: CALLBACK_URL,
            AccountReference: accountReference,
            TransactionDesc: description
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        res.json(stkResponse.data);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "STK push failed" });
    }
});

module.exports = router;
