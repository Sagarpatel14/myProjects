const urlModel = require("../models/urlModel");
const shortid = require("shortid");

//----------------------------------------------------------------------------------------
//                                1. API -  POST/url/shorten
//----------------------------------------------------------------------------------------

const createUrl = async function (req, res) {
  try {
    console.log("Create URL.");

    const body = req.body;

    if (Object.keys(body).length === 0) {
      return res
        .status(400)
        .send({ status: false, message: "Invalid Request Body: Body Empty." });
    }

    let { longUrl } = body;

    if (
      typeof longUrl === "undefined" ||
      longUrl === null ||
      (typeof longUrl === "string" && longUrl.length === 0)
    ) {
      return res
        .status(400)
        .send({ status: false, message: "Please enter a valid <longUrl>." });
    }

    if (
      !/^(https:\/\/www\.|http:\/\/www\.|www\.)[a-zA-Z0-9\-_.$]+\.[a-zA-Z]{2,5}(:[0-9]{1,5})?(\/[^\s]*)?/gm.test(
        longUrl
      )
    ) {
      return res
        .status(400)
        .send({ status: false, message: "<longURL> NOT a Valid URL Format." });
    }

    const longUrlUnique = await urlModel.findOne({ longUrl });
    if (longUrlUnique) {
      return res.status(400).send({
        status: false,
        message: `<longURL>: <${longUrl}> Already Exists in Database.`,
      });
    }

    const urlCode = shortid.generate().toLowerCase();
    const baseUrl = "localhost:3000" ;
    const shortUrl = baseUrl + "/" + urlCode;

    const data = { longUrl, shortUrl, urlCode };

    const createData = await urlModel.create(data);

    const result = {
      longUrl: createData.longUrl,
      shortUrl: createData.shortUrl,
      urlCode: createData.urlCode,
    };

    return res.status(201).send({
      status: true,
      message: "Successfully Generated Short URL.",
      data: result,
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

    const urlCode = req.params.urlCode;

    const findUrl = await urlModel.findOne({ urlCode });

    if (!findUrl) {
      return res
        .status(404)
        .send({ status: false, message: "URL Not Found ." });
    }

    return res.status(302).redirect(findUrl.longUrl);
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrl, getUrl };
