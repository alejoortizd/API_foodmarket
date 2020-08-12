const passport = require('passport');
const Product = require('../model/Product');

function renderForm(req, res) {
    res.send('Producto add')
}

function successLogin(req, res) {
    res.status(200).send({success: "ok"});
};

function failedLogin(req, res){
    res.status(401).send({error: "Unauthorizer"});
};

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

// async function getProducts(req, res, next) {

//     const order = req.body.order ? req.body.order : "desc";
//     const sortBy = req.body.sortBy ? req.body.sortBy : "_id";
//     const limit = req.body.limit ? parseInt(req.body.limit) : 100;
//     const skip = parseInt(req.body.skip);

//     const findArgs = {};
//     const term = req.query;

//     for (const key in term) {
//         if (req.query[key].length > 0) {
//             if (key === "price") {
//                 findArgs[key] = {
//                     $gte: req.body.filters[key][0],
//                     $lte: req.body.filters[key][1],
//                 };
//             }  else {
//                 findArgs[key] = req.query[key];
//             }
//         }
//     }
//     if (term) {
//         Product.find(findArgs)
//             .find(term)
//             .populate("writer")
//             .sort([[sortBy, order]])
//             .skip(skip)
//             .limit(limit)
//             .exec((err, products) => {
//             if (err) return res.status(400).json({ success: false, err });
//             res
//                 .status(200)
//                 .json({ success: true, products, postSize: products.length });
//         });
//     } else {
//         Product.find(findArgs)
//             .populate("writer")
//             .sort([[sortBy, order]])
//             .skip(skip)
//             .limit(limit)
//             .exec((err, products) => {
//         if (err) return res.status(400).json({ success: false, err });
//         res
//             .status(200)
//             .json({ success: true, products, postSize: products.length });
//         });
//     }
// }


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