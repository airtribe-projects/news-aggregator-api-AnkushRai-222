const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNews } = require('../controllers/newsController');

router.get('/news', auth, async (req, res) => {
  try {
    const news = await getNews(req.user);
    return res.status(200).json({ news });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

module.exports = router;
