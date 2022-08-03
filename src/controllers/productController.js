const productModel = require('../models/productModel')
const { validInstallment, isValidPrice, isValidSize, isImageFile, isValid, isValidName, isValidEmail, isValidExcerpt, isValidMobile, isValidPassword, isValidIsbn, isValidBody, isValidTitle, isValidPincode, isValidDate, isValidObjectId, isValidrating, isValidratingLength, isValidTName } = require('../validation/valid')
const { uploadFile } = require('../validation/aws')




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




//====================================GET ProductByQuery====================//

const getProduct = async function (req, res) {
    try {
        let data = req.query;
        let filter = { isDeleted: false }

        if (data.name || data.name === "") {
            if (!isValid(data.name)) return res.status(400).send({ status: false, message: "Enter the product name required" })
            if (!isValidName(data.name)) return res.status(400).send({ status: false, messge: "please Give Correct name" })

            filter.title = {};
            filter.title = data.name;
            // console.log(filter.title)
        }
        if (data.size || data.size === "") {
            if (!isValid(data.size)) {
                return res.status(400).send({ status: false, message: "Give a proper size of products" })
            }
            if (data.size) {
                var size = data.size.toUpperCase().split(",")
                if (size.length === 0) {
                    return res.status(400).send({ status: false, message: "please provide the product size" })
                }
                let enumSize = ["S", "XS", "M", "X", "L", "XXL", "XL"]
                for (let i = 0; i < size.length; i++) {
                    if (!enumSize.includes(size[i])) {
                        return res.status(400).send({ status: false, message: `Sizes should be ${enumSize} value (with multiple value please give saperated by comma)` })
                    }
                }

            }
            filter.availableSizes = {};
            filter.availableSizes["$in"] = size
            // console.log(filter.availableSizes)
        }
        if (data.priceGreaterThan === "" || data.priceLessThan === "") {
            return res.status(400).send({ status: false, message: "price can not be empty" })
        }
        if (data.priceGreaterThan || data.priceLessThan) {
            if (data.priceGreaterThan) {
                if (!isValid(data.priceGreaterThan)) {
                    return res.status(400).send({ status: false, message: "pricegreterthen can not be empty" })
                }
                let Gprice = Number(data.priceGreaterThan)
                if (!/^\d*\.?\d*$/.test(Gprice)) {
                    return res.status(400).send({ status: false, message: "price greaterthan should be in a number formate " })
                }
            }
            if (data.priceLessThan) {
                if (data.priceLessThan) {
                    if (!isValid(data.priceLessThan)) {
                        return res.status(400).send({ status: false, message: "pricelessthen can not be empty" })
                    }
                    let Lprice = Number(data.priceLessThan)
                    if (!/^\d*\.?\d*$/.test(Lprice)) {
                        return res.status(400).send({ status: false, message: "price lessthan should be in a number formate " })
                    }
                }

            }
            //console.log(data.priceGreaterThan)
            filter.price = {};
            if (data.priceGreaterThan && data.priceLessThan) {
                filter.price["$gt"] = data.priceGreaterThan
                filter.price["$lt"] = data.priceLessThan
            }
            else {
                if (data.priceGreaterThan) filter.price["$gt"] = data.priceGreaterThan;
                if (data.priceLessThan) filter.price["$lt"] = data.priceLessThan;
            }


        }

        let sortedPrice = data.priceSort;
        if (sortedPrice.trim() == "") return res.status(400).send({ status: false, message: "please do not leave sortedPrice empty" })
        if (sortedPrice) {
            if (!sortedPrice.match(/^(1|-1)$/)) {
                return res.status(400).send({ status: false, message: "priceSort should be 1 or -1" })
            }
        }


        //console.log(filter);
        let get = await productModel.find(filter).sort({ price: sortedPrice })
        if (get) {
            return res.status(200).send({ status: true, message: "success", data: get })
        }
        return res.status(400).send({ status: false, message: "No product found" })


    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })

    }
}







//===============================  Get Poduct By Id  =========================================//

const getProductById = async function (req, res) {
    try {
        //userid from path=========================================================//
        const product_id = req.params.productId;

        //id validation============================================================//
        if (!isValidObjectId(product_id)) { return res.status(400).send({ status: false, message: `This ${product_id} is invalid productId` }); }

        const product = await productModel.findOne({ _id: product_id, isDeleted: false })
        // product not found===================================================//
        if (!product) { return res.status(404).send({ status: false, message: "Product not found" }); }

        //return product in response===============================================//
        return res.status(200).send({ status: true, message: "Success", data: product });

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }

}





const updateProduct = async function (req, res) {
    try {
        let productId = req.params.productId;
        let body = req.body;
        let { title, description, price, currencyId, currencyFormat, isFreeShipping, productImage, style, availableSizes, installments } = body;
        if (!productId) return res.status(400).send({ status: false, message: 'pls give a productId in params' })
        if (!isValidObjectId(productId)) return res.status(400).send({ status: false, message: 'pls give a valid productId in params' })
        let product = await productModel.findById(productId)
        if (!product) return res.status(404).send({ status: false, message: 'No product found with product id in params' })
        if (!(product.isDeleted == false)) return res.status(400).send({ status: false, message: 'sorry, the product is already deleted' })

        if (Object.keys(body).length === 0 && req.files == undefined) return res.status(400).send({ status: false, message: 'please enter body' })
        let sizes = ["S", "XS", "M", "X", "L", "XXL", "XL"]
        let obj = {};
        if (title == "") return res.status(400).send({ status: false, message: "Don't leave title Empty" })
        if (title) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: 'do not leave title empty' })
            if (await productModel.findOne({ title })) return res.status(400).send({ status: false, message: "this title has already been used" })
            if (!isValidName(title)) return res.status(400).send({ status: false, message: 'please enter title in valid format' })
            let trimmedTitle = title.trim().toLowerCase()
            obj.title = trimmedTitle
        }
        if (description == "") return res.status(400).send({ status: false, message: "Don't leave description Empty" })
        if (description) {
            if (!isValid(description)) return res.status(400).send({ status: false, message: 'do not leave title empty' })
            if (!isValidName(description)) return res.status(400).send({ status: false, message: 'please enter description in correct format' })
            let trimmedDescription = description.trim().toLowerCase()
            obj.description = trimmedDescription
        }
        if (price == "") return res.status(400).send({ status: false, message: "Don't leave price Empty" })
        if (price) {
            let price1 = parseInt(price)
            if (typeof price1 !== "number") return res.status(400).send({ status: false, message: 'type of price should be Number' })
            if (!isValidPrice(price1)) return res.status(400).send({ status: false, message: 'price should only be a number or decimal' })
            obj.price = price
        }
        if (isFreeShipping == "") return res.status(400).send({ status: false, message: "Don't leave isFreeShipping Empty" })
        if (isFreeShipping) {
            if (typeof isFreeShipping !== "boolean") return res.status(400).send({ status: false, message: 'type of isFreeShipping should be boolean' })
            obj.isFreeShipping = isFreeShipping
        }
        if (productImage) {
            let files = req.files
            if (!(files && files.length > 0)) {
                return res.status(400).send({ status: false, message: " Please Provide The product Image" });
            }
            const uploadedProductImage = await uploadFile(files[0])
            obj.productImage = uploadedProductImage
        }
        if (style == "") return res.status(400).send({ status: false, message: "Don't leave style Empty" })
        if (style) {
            if (!isValid(style)) return res.status(400).send({ status: false, message: 'do not leave style empty' })
            if (!isValidName(style)) return res.status(400).send({ status: false, message: 'give style in valid format' })
            let trimmedStyle = style.trim()
            obj.style = trimmedStyle
        }
        if (availableSizes == "") return res.status(400).send({ status: false, message: "Don't leave availableSizes Empty" })
        if (availableSizes) {    // validations for empty fields 
            let sizeArr = availableSizes.split(",")
            for (let i = 0; i < sizeArr.length; i++) {
                if (sizes.includes(sizeArr[i])) {
                    product.availableSizes.push(sizeArr[i])
                    let avoidDup = [...new Set(product.availableSizes)]
                    obj.availableSizes = avoidDup
                } else {
                    return res.status(400).send({ status: false, message: `available sizes should be from ${sizes}` })
                }
            }
            // if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: 'do not leave availableSizes empty' })
            // if (!(sizes.includes(availableSizes))) return res.status(400).send({ status: false, message: `available sizes should be from ${sizes}` })
        }
        if (installments == "") return res.status(400).send({ status: false, message: "Don't leave installments Empty" })
        if (installments) {
            installments = parseInt(installments)
            if (!isValid(installments)) return res.status(400).send({ status: false, message: 'do not leave installments empty' })
            if (!(typeof installments == "number")) return res.status(400).send({ status: false, message: 'type of installments should be Number' })
            if (!isValidPrice(installments)) return res.status(400).send({ status: false, message: 'installments should only be a integer' })
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
                product.isDeleted = true
                product.deletedAt = new Date()
                product.save()
            } else {
                return res.status(404).send({ status: false, message: 'the product is already deleted' })
            }
        } else {
            return res.status(404).send({ status: false, message: 'sorry, No such product found' })
        }
        res.status(200).send({ status: true, message: "successfully deleted", data: product })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

module.exports = { createProduct, getProduct, getProductById, updateProduct, deleteProduct }


