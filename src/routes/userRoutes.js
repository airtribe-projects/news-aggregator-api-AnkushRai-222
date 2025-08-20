const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  getPreferences,
  updatePreferences,
  getNews,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const { body, param, validationResult } = require("express-validator");

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.post("/users/signup", [
    body("name").notEmpty().trim().withMessage("name is required"),
    body("email").notEmpty().trim().withMessage("email is required"),
    body("password").notEmpty().trim().withMessage("password is required"),
  ], handleValidation, async (req, res) => {
  const { name, email, password, preferences } = req.body;
  signup({ name, email, password, preferences })
    .then((data) => res.status(200).json({ user: data.toJSON() }))
    .catch((err) => res.status(err.status || 500).json({ error: err.message }));
});

router.post("/users/login", [
    body("email").notEmpty().trim().withMessage("email is required"),
    body("password").notEmpty().trim().withMessage("password is required"),
  ], handleValidation, async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await login({ email, password });
      return res.status(200).json({ token });
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
});


router.get("/users/preferences", auth, async (req, res) => {
  try {
    const preferences = await getPreferences(req.user);
    return res.status(200).json({ preferences });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

router.put("/users/preferences", auth, [
    body("preferences").isArray().withMessage("preferences must be an array"),
  ], handleValidation, async (req, res) => {
  try {
    const preferences = await updatePreferences(req.user, req.body.preferences);
    return res.status(200).json({ preferences });
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message });
  }
});

// News (protected)
// router.get('/news', auth, async (req, res) => {
//   try {
//     const news = await getNews();
//     return res.status(200).json({ news });
//   } catch (err) {
//     return res.status(500).json({ error: err.message });
//   }
// });

module.exports = router;
