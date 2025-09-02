const axios = require('axios');
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const URL = process.env.NEWS_API_URL;


exports.getNews = async (user) => {
  try {
    if (!user) {
      const err = new Error("Authentication required");
      err.status = 401;
      throw err;
    }

    const prefs = Array.isArray(user.preferences)
      ? user.preferences.map((p) => String(p).trim()).filter(Boolean)
      : [];

    const q = prefs.length ? prefs.join(" OR ") : "news";

    if (!NEWS_API_KEY || !URL) {
      const err = new Error("Server misconfiguration: NEWS_API_KEY and NEWS_API_URL must be set");
      err.status = 500;
      throw err;
    }

    const resp = await axios.get(URL, {
      params: {
        q,
        language: "en",
        pageSize: 20,
        sortBy: "publishedAt",
        apiKey: NEWS_API_KEY,
      },
      timeout: 8000,
    });

    return resp.data && resp.data.articles ? resp.data.articles : [];
  } catch (e) {
    const err = new Error("Failed to fetch news from external API");
    err.status = 502;
    err.cause = e.message;
    throw err;
  }
};
