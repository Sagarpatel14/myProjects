const shortid = require("shortid");
const urlModel = require("../models/urlModel");

////!!!!!!!!!!!!!!!!!!!!!!!!!
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
  13190,
  "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com",
  { no_ready_check: true }
);
redisClient.auth("gkiOIPkytPI3ADi14jHMSWkZEo2J5TDG", function (err) {
  if (err) throw err;
});

redisClient.on("connect", async function () {
  console.log("Connected to Redis..");
});

//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);
////!!!!!!!!!!!!!!!!!!!!!!!!!

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

    //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    let cachesUrlData = await GET_ASYNC(`${req.body.longUrl}`);
    // let cachesUrlData = await GET_ASYNC(req.body.longUrl);
    if (cachesUrlData) {
      return res
        .status(200)
        .send({ status: true, data: JSON.parse(cachesUrlData) });
    } else {
      const longUrlUnique = await urlModel.findOne({ longUrl });
      if (longUrlUnique) {
        return res.status(400).send({
          status: false,
          message: `<longURL>: <${longUrl}> Already Exists in Database.`,
        });
      }

      const urlCode = shortid.generate().toLowerCase();
      const baseUrl = "localhost:3000";
      const shortUrl = baseUrl + "/" + urlCode;

      const data = { longUrl, shortUrl, urlCode };

      const createData = await urlModel.create(data);

      const result = {
        longUrl: createData.longUrl,
        shortUrl: createData.shortUrl,
        urlCode: createData.urlCode,
      };

      await SET_ASYNC(`${req.body}`, JSON.stringify(result));
      // await SET_ASYNC(req.body, JSON.stringify(result));

      return res.status(201).send({
        status: true,
        message: "Successfully Generated Short URL.",
        data: result,
      });
    }
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

    let requestParams = req.params.urlCode;

    let cachesUrlData = await GET_ASYNC(`${requestParams}`);
    // let cachesUrlData = await GET_ASYNC(requestParams);

    //convert to object
    const urlData = JSON.parse(cachesUrlData);
    if (cachesUrlData) {
      return res.status(302).redirect(urlData.longUrl);
    } else {
      let findUrlCode = await urlModel
        .findOne({ urlCode: requestParams })
        .select({ urlCode: 1, longUrl: 1, shortUrl: 1 });

      if (!findUrlCode) {
        return res
          .status(404)
          .send({ status: false, message: "urlCode NOT Found." });
      }

      await SET_ASYNC(`${requestParams}`, JSON.stringify(findUrlCode));
      return res.status(302).redirect(findUrlCode.longUrl);
    }
  } catch (error) {
    return res.status(500).send({ status: false, message: error.message });
  }
};

module.exports = { createUrl, getUrl };
