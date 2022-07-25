const express = require('express');
const router = express.Router();





router.all('/*/', async function(req, res){
    res.status(404).send({status: false, msg: "Page Not Found!!!"})
})



module.exports=router;