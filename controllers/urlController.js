const { nanoid } = require('nanoid');
const URL = require('../models/urlModel');

exports.createShortUrl = async (req, res) => {
    try {
        const { originalUrl, customCode, validityMinutes } = req.body;
        if (!originalUrl) return res.status(400).json({ error: 'Original URL is required' });

        let shortCode = customCode || nanoid(7);
        let existing = await URL.findOne({ shortCode });
        if (existing) return res.status(400).json({ error: 'Shortcode already exists' });

        const minutes = validityMinutes || 30;
        const expiresAt = new Date(Date.now() + minutes * 60000);

        const newUrl = await URL.create({ originalUrl, shortCode, expiresAt });
        res.json({ shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}` });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.redirectUrl = async (req, res) => {
    try {
        const { code } = req.params;
        const urlData = await URL.findOne({ shortCode: code });

        if (!urlData) return res.status(404).json({ error: 'Shortcode not found' });
        if (urlData.expiresAt < Date.now()) return res.status(410).json({ error: 'Link expired' });

        res.redirect(urlData.originalUrl);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getStats = async (req, res) => {
    try {
        const { code } = req.params;
        const urlData = await URL.findOne({ shortCode: code });
        if (!urlData) return res.status(404).json({ error: 'Shortcode not found' });

        res.json({
            originalUrl: urlData.originalUrl,
            shortCode: urlData.shortCode,
            expiresAt: urlData.expiresAt,
            createdAt: urlData.createdAt
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

