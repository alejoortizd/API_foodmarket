const Product = require('../model/Product');

function renderForm(req, res) {
    res.send('Producto add')
}

async function getProducts(req, res, next) {
    const { tags } = req.query;

    try {
        const products = await Product.find({ tags })

        res.status(200).json({
            data: products,
            message: 'Prodcuts listed'
        })
    } catch (error) {
        next(error)
    }
}

async function createProduct(req, res) {
    const product = new Product(req.body);
    await product.save()
        .then(product => {
            res.status(201).send({product})
        }).catch(err => res.status(500).send({err}))
}

async function getProduct(req, res, next) {
    const { productId } = req.params;

    try {
        const product = await Product.findOne({ _id: productId })

        res.status(200).json({
            data: product,
            message: 'Product retieved'
        });
    } catch (error) {
        next(error)
    }
}

async function updateProduct(req, res, next) {
    const { productId } = req.params
    const {body: product} = req
    
    try {
        const updatedProduct = await Product.updateOne({ _id: productId }, { $set: product })
        res.status(200).json({
            data: updatedProduct,
            message: "product updated"
        })
    } catch (error) {
        next(error);
    }
}

async function deleteProduct(req, res, next) {
    const { productId } = req.params;

    try {
        const deleteProduct = await Product.deleteOne({ _id: productId})
        res.status(200).json({
            data: deleteProduct,
            message: 'Product deleted'
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    renderForm,
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
}