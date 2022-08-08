const cartModel = require('../models/cartModel')
const productModel = require('../models/productModel')
const userModel = require('../models/userModel')

let { isValidLimit, isValid, isValidName, isValidEmail, isValidExcerpt, isValidMobile, isValidPassword, isValidIsbn, isValidBody, isValidTitle, isValidObjectId, } = require('../validation/valid')


const createCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let productId = req.body.productId
        let cartId = req.body.cartId

        let productDetails = {
            productId,
            quantity: 1
        }
        let items = [productDetails]

        

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: "invalid user Id.." })
        const isValidUser = await userModel.findById(userId)
        if (!isValidUser) return res.status(404).send({ status: false, message: "user not found" })


        if (!isValid(productId)) return res.status(400).send({ status: false, message: "product Id must be present in request Body.." })
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: "invalid product Id.." })
        const product = await productModel.findOne({ _id: productId, isDeleted: false })
        if (!product) return res.status(404).send({ status: false, message: "product not found or may be deleted..." })
        const productPrice = product.price


        if (cartId) {
            if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: "invalid cart Id.." })
            if(!await cartModel.findById(cartId)) return res.status(404).send({ status: false, message: "No such cart found" })
        }
        const cart = await cartModel.findOne({userId})
       // if(!cart) return res.status(404).send({status:true, message:'no such cart found with this cartId'})

        if (cart) {
            let productIds = cart.items.map(x => x.productId.toString())
            if (productIds.includes(productId)) {
                let updatedCart = await cartModel.findOneAndUpdate({ "items.productId": productId, userId: userId }, { $inc: { "items.quantity": 1, totalPrice: productPrice } }, { new: true })
                return res.status(200).send({ status: true, message: "items added successfully", data: updatedCart })
            }
            else {

                let updatedCart = await cartModel.findOneAndUpdate({ userId: userId }, { $push: { items: productDetails }, $inc: { totalItems: 1, totalPrice: productPrice } }, { new: true })
                return res.status(200).send({ status: true, message: "items added successfully", data: updatedCart })
            }
        }

        const cartCreate = {
            userId: userId,
            items: items,
            totalItems: items.length,
            totalPrice: productPrice
        }
        const cartCreated = await cartModel.create(cartCreate)
        return res.status(201).send({ status: true, message: "cart created successfully", data: cartCreated })
    }
    catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}







const updateCart = async function (req, res) {
    try {
        let userId = req.params.userId
        let body = req.body
        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'pls give body' })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'pls give a valid userId in params' })


        let { cartId, productId, removeProduct } = body
        if (!cartId) return res.status(400).send({ status: false, message: 'please enter cartId, it is required' })
        if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: 'pls give a valid cartId' })
        let cart = await cartModel.findOne({_id:cartId,userId:userId})
        if (!cart) return res.status(404).send({ status: false, message: 'sorry, No such cart found with this cartId and userId ' })

        if (!productId) return res.status(400).send({ status: false, message: 'please enter productId, it is required' })
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: 'pls give a valid productId' })
        let product = await productModel.findById(productId)
        if (!product) return res.status(404).send({ status: false, message: 'sorry, No such product found with this productId ' })

        let temp = []
        for(let i=0; i<cart.items.length; i++){
            temp.push(cart.items[i].productId.toString())
        }
        if(!temp.includes(productId)) return res.status(404).send({status:false, message:'this productId does not exist in the cart or deleted'})

        let productPrice = product.price
        let quantity = cart.items.filter(x => x.productId.toString()===productId)[0].quantity
        //console.log(quantity);

        //if (!removeProduct) return res.status(400).send({ status: false, message: 'please enter removeProduct, it is required' })

        if (!(removeProduct == 0 || removeProduct == 1)) return res.status(400).send({ status: false, message: 'removeProduct can only be 0 or 1' })

        if (removeProduct == 0) {
            let deleteProduct = await cartModel.findOneAndUpdate({_Id:cartId,userId},{$pull :{items:{productId}}, $inc: {totalItems:-1, totalPrice:-productPrice*quantity}},{new:true})
            return res.status(200).send({status:true, message:'success',data:deleteProduct})
        } else {
            if(quantity>1){
                let decreasedQuant = await cartModel.findOneAndUpdate({'items.productId':productId,userId:userId},{$inc: {"items.$.quantity":-1, totalPrice:-productPrice}},{new:true})
                return res.status(200).send({status:true, message:'success',data:decreasedQuant})
            }else{
                let deleteProduct = await cartModel.findOneAndUpdate({'items.productId':productId,userId:userId},{$pull: {items: {productId}}, $inc: {totalItems:-1,totalPrice:-productPrice}},{new:true})
                return res.status(200).send({status:true, message:'success',data:deleteProduct})

            }
        }
        // cart.save()
        // res.status(200).send({ status: true, message: "success", data: cart })

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, message: error.message })
    }
}



//=========================getCart==============================//
const getCart = async function(req, res) {
    try {

        let userId = req.params.userId
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: ` this ${userId} is invalid userId` })
        }
        let checkUser = await cartModel.findOne({ userId: userId })
        //console.log(checkUser)
        if (!checkUser) {
            return res.status(404).send({ status: false, msg: 'user not found' })
        }
        res.status(200).send({ status: true, message: "Success", data: checkUser })
    } catch (err) {
        res.status(500).send({ status: true, data: checkUser })
    }
}


//=======================================================delete cart=====================

const deleteCart = async function(req, res) {
    try {
        let user_id = req.params.userId
            //id format validation
        if (!isValidObjectId(user_id)) {
            return res.status(400).send({ status: false, msg: `this ${user_id} is invalid userId` })
        }
        //check if the document is found with that user id 
        let checkUser = await userModel.findOne({ _id: user_id }, { isDeleted: false })
        //console.log(checkUser)
        if (!checkUser) { return res.status(404).send({ status: false, msg: "user not found" }) }

        let checkId = await cartModel({ userId: user_id })
        if (!checkId) {
            return res.status(404).send({ status: false, msg: "user does not exist" })
        }

        let cartDeleted = await cartModel.findOneAndUpdate({ userId: user_id }, { $set: { items: [], totalItems: 0, totalPrice: 0 } }, { new: true }).select({ items: 1, totalPrice: 1, totalItems: 1, _id: 0 });

        res.status(204).send({ status: true, msg: "cart data successfully deleted", data: cartDeleted })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}




module.exports = { createCart, updateCart,getCart,deleteCart }