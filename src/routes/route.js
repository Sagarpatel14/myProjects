const express = require("express");
const router = express.Router();

const urlController = require("../controllers/urlController");

router.post("/url/shorten", urlController.createUrl);

router.get("/:urlCode", urlController.getUrl);

//1. Invalid API requested.
router.all("/**", function (req, res) {
  res.status(400).send({
    status: false,
    message: "INVALID END-POINT: The API You requested is NOT available.",
  });
});

module.exports = router;
