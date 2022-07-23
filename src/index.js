const express = require("express");
const bodyparser = require('body-parser') 
const mongoose = require("mongoose");
const route = require("./routes/route");

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://Vikas:pAeAi3B.8Rhcfa2@cluster0.tnyfk.mongodb.net/group_1_Database",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB connected."))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});
