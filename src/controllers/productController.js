const productModel = require('../models/productModel')
const { uploadFile } = require('../validation/aws')// require aws 

//<===========require Validation and destructing==============================================>

const { validInstallment,isValidPrice, isValidSize, isImageFile, isValid, isValidName, isValidEmail, isValidMobile, isValidPassword, isValidBody, isValidTitle, isValidPincode, isValidDate, isValidObjectId, isValidrating, isValidratingLength, isValidTName, isValidAddress } = require('../validation/valid')

const createProduct = async function (req, res) {
    try {
        const body = req.body
        const files = req.files
        //===================================body check============================================>
        if (isValidBody(body)) return res.status(400).send({ status: false, message: "Please provied Data" })


        //===================================distructing======================================>

        let { title, description, price, currencyId, currencyFormat, style, availableSizes, installments } = body



        //===================================== title ==============================================>
        // if (!title) return res.status(400).send({ status: false, message: "please provide title it is required" })

        if (!isValid(title)) return res.status(400).send({ status: false, message: "please provide title it is required" })

        if (!isValidName(title)) return res.status(400).send({ status: false, messge: "please Give Correct Title" })

        if (await productModel.findOne({ title })) return res.status(400).send({ status: false, message: "This title is already used" })


        //==================================== description ==========================================>

        if (!isValid(description)) return res.status(400).send({ status: false, message: "please provide description" })

        if (!isValidName(description)) return res.status(400).send({ status: false, messge: "please Give Correct description" })


        //========================================= price ============================================>

        if (!price) return res.status(400).send({ status: false, message: "please provide price" })
        price = parseInt(price)
        //  console.log(typeof(price));
        if (typeof price !== "number") return res.status(400).send({ status: false, message: 'type of price should be Number' })

        if (!isValidPrice(price)) return res.status(400).send({ status: false, message: "price should be integer or decimal" })



        //=====================================currencyId============================================>
        if (!isValid(currencyId)) return res.status(400).send({ status: false, message: "please provide currencyId" })

        if (currencyId != "INR") return res.status(400).send({ status: false, message: "currencyId should only be INR" })


        //======================================== currencyFormat====================================>

        if (!isValid(currencyFormat)) return res.status(400).send({ status: false, message: "please provide currencyFormat" })

        if (currencyFormat != "₹") return res.status(400).send({ status: false, message: "currencyFormat should only be ₹ " })


        //========================================productImage=======================================>
        if (!(files && files.length > 0)) {
            return res.status(400).send({ status: false, message: " Please Provide The product Image" });
        }
        if (!isImageFile(files[0].originalname)) return res.status(400).send({ status: false, message: " Please Provide The product Image in jpeg,jpg,png,gif,JPGE,JPG,PNG,GIF" });

        const uploadedBookImage = await uploadFile(files[0])
        body.productImage = uploadedBookImage


        //===========================================style============================================>

        // 
        if (style) {
            if (!isValid(style)) return res.status(400).send({ status: false, message: "please provide style in correct form" })

            if (!isValidName(style)) return res.status(400).send({ status: false, messge: "please Give Correct style" })

        }


        //===========================================availableSizes===================================>
        if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "please provide availableSizes" })

        availableSizes = availableSizes.split(',').map(x => x.trim().toUpperCase())
        if (availableSizes.map(x => isValidSize(x)).filter(x => x === false).length !== 0) return res.status(400).send({ status: false, message: "Size Should be Among  S,XS,M,X,L,XXL,XL" })
        body.availableSizes = availableSizes


        //============================================installments =====================================>
        if (installments) {

            if (!installments) return res.status(400).send({ status: false, message: "please provide installments" })

            installments = parseInt(installments)

            if (typeof price !== "number") return res.status(400).send({ status: false, message: 'type of installments should be Number' })

            if (!validInstallment(installments)) return res.status(400).send({ status: false, message: "installments should be integer" })

            

        }

        const createProduct = await productModel.create(body)
        res.status(201).send({ status: true, message: "Success", data: createProduct })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = { createProduct }