const productModel = require('../models/productModel')
const { isValid, isValidName,isValidPrice, isValidEmail, isValidMobile, isValidPassword, isValidBody, isValidTitle, isValidPincode, isValidDate, isValidObjectId, isValidrating, isValidratingLength, isValidTName } = require('../validation/valid')
const { uploadFile } = require('../validation/aws')


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






const updateProduct = async function(req, res){
    try{
        let productId = req.params.productId;
        if (!productId) return res.status(400).send({ status: false, message: 'pls give a productId in params' })
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: 'pls give a valid productId in params' })
        let product = await productModel.findById(productId)
        if(!product) return res.status(404).send({ status: false, message: 'No product found with product id in params' })
        if(!(product.isDeleted == false)) return res.status(400).send({ status: false, message: 'sorry, the product is already deleted' })

        let body = req.body;
        if (Object.keys(body).length === 0 && req.files == undefined) return res.status(400).send({ status: false, message: 'please enter body' })
        let {title,description,price,currencyId,currencyFormat,isFreeShipping,productImage,style,availableSizes,installments} = body;
        let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        let obj = {};
        if(title){
            if(!isValid(title)) return res.status(400).send({status:false, message:'do not leave title empty'})
            if(!isValidName(title)) return res.status(400).send({status:false, message:'please enter title in valid format'})
            let trimmedTitle = title.trim().toLowerCase()
            obj.title = trimmedTitle
        }
        if(description){
            if(!isValid(description)) return res.status(400).send({status:false, message:'do not leave title empty'})
            let trimmedDescription = description.trim().toLowerCase()
            obj.description = trimmedDescription
        }
        if(price){
            let price = parseInt(price)
            if(!(typeof price == "number")) return res.status(400).send({status:false, message:'type of price should be Number'})
            if(!isValidPrice(price)) return res.status(400).send({status:false, message:'price should only be a number or decimal till to places'})
            obj.price = price
        }
        if(isFreeShipping){
            if(!(typeof isFreeShipping == "boolean" )) return res.status(400).send({status:false, message:'type of isFreeShipping should be boolean'})
            obj.isFreeShipping = isFreeShipping
        }
        if(productImage){
            let files = req.files
            if (!(files && files.length > 0)) {
                return res.status(400).send({ status: false, message: " Please Provide The product Image" });
            }
            const uploadedProductImage = await uploadFile(files[0])
            obj.productImage = uploadedProductImage
        }
        if(style){
            if(!isValid(style)) return res.status(400).send({status:false, message:'do not leave style empty'})
            if(!isValidName(style)) return res.status(400).send({status:false, message:'give style in valid format'})
            let trimmedStyle = style.trim()
            obj.style = trimmedStyle
        }
        if(availableSizes){
            if(!isValid(availableSizes)) return res.status(400).send({status:false, message:'do not leave availableSizes empty'})
            if(!(sizes.includes(availableSizes))) return res.status(400).send({status:false,message:`available sizes should be from ${sizes}`})
            obj.availableSizes = availableSizes
        }
        if(installments){
            let installments = parseInt(installments) 
            if(!isValid(installments)) return res.status(400).send({status:false, message:'do not leave installments empty'})
            if(!(typeof installments == "number")) return res.status(400).send({status:false, message:'type of installments should be Number'})
            if(!isValidPrice(installments)) return res.status(400).send({status:false, message:'installments should only be a integer'})
            obj.installments = installments
        }

        let updatedProduct = await productModel.findOneAndUpdate({ _id: productId }, { $set: obj }, { new: true })
        res.status(200).send({ status: true, message: "product updated", data: updatedProduct })


    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}



const deleteProduct = async function (req, res) {
    try {
        let productId = req.params.productId;
        if (!productId) return res.status(400).send({ status: false, message: 'pls give a productId in params' })
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: 'pls give a valid productId in params' })
        let product = await productModel.findById(productId)
        if (product) {
            if (product.isDeleted == false) {
                product.isDeleted == true
                product.deletedAt = new Date()
                product.save()
            } else {
                return res.status(404).send({ status: false, message: 'the product is already deleted' })
            }
        } else {
            return res.status(404).send({ status: false, message: 'sorry, No such product found' })
        }
        res.status(200).send({status:true, message:"successfully deleted", data:product})

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

module.exports = {createProduct, updateProduct, deleteProduct }