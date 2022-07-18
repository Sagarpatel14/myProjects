const urlModel = require("../models/urlModel");
const validUrl = require("valid-url");
const shortid = require("shortid");

//----------------------------------------------------------------------------------------
//                                1. API -  POST/url/shorten
//----------------------------------------------------------------------------------------

const createUrl = async function (req, res) {
  try {
    console.log("Create URL.");

    let { longUrl } = req.body ; 

    let shortUrl ;
    let urlCode ;


    return res.status(201).send({
      status: true,
      message: "Successfully Generated Short URL.",
      data: "[]",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

//----------------------------------------------------------------------------------------
//                                2. API -  GET/:urlCode
//----------------------------------------------------------------------------------------

const getUrl = async function (req, res) {
  try {
    console.log("GET URL.");

    return res.status(200).send({
      status: true,
      message: "Successfully Fetched URL.",
      data: "[]",
    });
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrl, getUrl };
