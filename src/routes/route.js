const express = require('express')
const router = express.Router()
const controller = require('../controllers/controller')

let {authentication} = require('../middleware/auth')


router.post('/user', controller.createUser)
router.post('/login', controller.userLogin)
router.post('/product/:userId',authentication, controller.createProduct)
router.get('/product/:userId',authentication, controller.getProduct)
router.get('/amount/:userId',authentication, controller.getAmount)

module.exports =  router