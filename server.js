const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS 설정 (모든 도메인 허용 또는 내 프론트엔드 주소만 허용)
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Gemini API 프록시 엔드포인트
app.post('/api/gemini', async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: { message: 'Server API key is not configured.' } });
        }

        const clientPayload = req.body;
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`;

        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientPayload)
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Gemini Proxy Error:', error);
        res.status(500).json({ error: { message: 'Internal server error during Gemini request.' } });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});