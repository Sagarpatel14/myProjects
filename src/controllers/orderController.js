const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');
const { isValid, isValidBody,isValidObjectId } = require('../validation/valid');

const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let body = req.body
        let { cartId } = body
        //pending:- with a cart id many order are created, prevent that

        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Invalid userId' })
        if (!(await userModel.findById(userId))) return res.status(404).send({ status: false, message: 'No user found, with userId' })
        //if (!(await cartModel.findOne({ userId }))) return res.status(404).send({ status: false, message: 'No cart found, with userId' })
        
        if (!("cartId" in body)) return res.status(400).send({ status: false, message: 'please, give cartId in body, it is required' })
        if (!isValid(cartId)) return res.status(400).send({ status: false, message: 'please do not leave cartId empty' })
        if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: 'Invalid cartId' })
        let cart = await cartModel.findOne({_id:cartId,userId})
        if (!cart) return res.status(404).send({ status: false, message: 'No cart found, with cartId and userId' })
        if(cart.items.length==0) return res.status(404).send({ status: false, message: 'No cart found' })
        if(await orderModel.findOne({userId})) return res.status(409).send({status:false, message:'Already a order exist with this userId'})
        let items = cart.items;
        let totalPrice = cart.totalPrice;
        let totalItems = cart.totalItems;
        let totalQuantity = 0
        for (let i = 0; i < cart.items.length; i++) {
            totalQuantity += cart.items[i].quantity
        }

        let orderDetails = {}

        orderDetails.userId = userId;
        orderDetails.items = items;
        orderDetails.totalPrice = totalPrice;
        orderDetails.totalItems = totalItems;
        orderDetails.totalQuantity = totalQuantity;

        let orderdata = await orderModel.create(orderDetails)
        res.status(201).send({ status: true, message: 'success', data: orderdata })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



const updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let body = req.body
        let { orderId, status } = body

        if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Invalid userId' })
        if (!(await userModel.findById(userId))) return res.status(404).send({ status: false, message: 'No user found, with userId' })
        if (!(await orderModel.findOne({ userId }))) return res.status(404).send({ status: false, message: 'No order found, with userId' })
        let cart = await cartModel.findOne({userId})

        if (!("orderId" in body)) return res.status(400).send({ status: false, message: 'please, give orderId in body, it is required' })
        if (!isValid(orderId)) return res.status(400).send({ status: false, message: 'please do not leave orderId empty' })
        if (!isValidObjectId(orderId)) return res.status(400).send({ status: false, message: 'Invalid orderId' })
        let order = await orderModel.findOne({_id:orderId,userId:userId})
        if (!order) return res.status(404).send({ status: false, message: 'No order found, with orderId and userId' })
        if(order.status == 'cancled') return res.status(400).send({ status: false, message: 'order already cancelled, can not be updated ' })

        let validStatus = ['pending', 'completed', 'cancled']
        if (!("status" in body)) return res.status(400).send({ status: false, message: 'please, give status key in body, it is required' })
        if (!isValid(status)) return res.status(400).send({ status: false, message: 'please do not leave status empty' })
        if (!validStatus.includes(status)) return res.status(400).send({ status: false, message: `status should be among  ${validStatus} ` })


        if (status == 'cancled') {
            if (order.cancellable === true) {
                order.status = status
                order.save()
            }else{
                return res.status(400).send({status:true, message:'order can not be cancled'})
            }
        } else {
            order.status = status
            order.save()
        }
        if(order.status !== 'pending'){
            for(let i=0; i<cart.items.length; i++){
                cart.items.splice(0,cart.items.length)
            }
            cart.totalItems = 0;
            cart.totalPrice = 0;
            cart.save()
        }
        res.status(200).send({ status: true, message: 'success', data: order })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createOrder, updateOrder }

