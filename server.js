const express = require("express");
const app = express();
const mongoose = require("mongoose");
const shortUrl = require("./models/shortUrl");
const port = process.env.PORT || 5000;

mongoose.connect("mongodb://localhost/urlShrinker", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  const ShortUrls = await shortUrl.find();
  res.render("index", { ShortUrls: ShortUrls });
});

app.post("/shortUrl", async (req, res) => {
  await shortUrl.create({ full: req.body.fullUrl });

  res.redirect("/");
});

app.get("/:shorturl", async (req, res) => {
  const Short_Urls = await shortUrl.findOne({
    short: req.params.shorturl,
  });

  if (Short_Urls == null) return res.sendStatus(404);

  Short_Urls.clicks++;
  Short_Urls.save();

  res.redirect(Short_Urls.full);
});

app.listen(port);
