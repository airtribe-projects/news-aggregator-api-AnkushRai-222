require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require('./src/routes/userRoutes');
const newsRoutes = require('./src/routes/newsRoutes');

const port = process.env.SERVER_PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

app.use('/', userRoutes);
app.use('/', newsRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("🟢 Connected With Mongodb DataBase");
    
    app.listen(port, (err) => {
      if (err) {
        return console.log("Something bad happened", err);
      }
      console.error(`Server is listening on ${port}`);
    });
  })
  .catch((err) => console.error(err));

module.exports = app;
