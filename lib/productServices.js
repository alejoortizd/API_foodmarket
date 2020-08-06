const Product = require("../model/Product");
const cloudinay = require("cloudinary");
const fs = require("fs-extra");
const { config } = require("../config");
const cacheResponse = require("../utils/cacheResponse");
const {
    FIVE_MINUTES_IN_SECONDS,
    SIXTY_MINUTES_IN_SECONDS,
} = require("../utils/time");

function renderForm(req, res) {
  res.render("productos/new-product");
}

async function createNewProduct(req, res, next) {
    const product = new Product(req.body);
    product.user = req.user._id;
    try {
        const imageUrl = await cloudinay.v2.uploader.upload(req.file.path);
        product.originpath = imageUrl.secure_url;
        const nproduct = await product.save();
        await fs.unlink(req.file.path);
        if (nproduct) {
            req.flash("success_msg", "Product Added Succesfully");
            res.redirect("/products/add");
        } else {
            req.flash("error_msg", "Nombre repetido"), res.redirect("/products/add");
        }
    } catch (error) {
        next(error);
    }
}

async function getProducts(req, res) {
    const order = req.body.order ? req.body.order : "desc";
    const sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    const limit = req.body.limit ? parseInt(req.body.limit) : 100;
    const skip = parseInt(req.body.skip);

    const findArgs = {};
    const term = req.query;

    for (const key in term) {
        if (req.query[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1],
            };
        }  else {
            findArgs[key] = req.query[key];
            }
        }
    }

  // console.log(findArgs);
  // console.log(term);

    if (term) {
        Product.find(findArgs)
            .find(term)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, products) => {
                if (err) return res.status(400).json({ success: false, err });
                res
                    .status(200)
                    .json({ success: true, products, postSize: products.length });
            });
        } else {
            Product.find(findArgs)
                .populate("writer")
                .sort([[sortBy, order]])
                .skip(skip)
                .limit(limit)
                .exec((err, products) => {
                    if (err) return res.status(400).json({ success: false, err });
                    res
                        .status(200)
                        .json({ success: true, products, postSize: products.length });
                });
        }
}

async function renderProducts(req, res, next) {
    cacheResponse(res, FIVE_MINUTES_IN_SECONDS);
    const userId = req.user.id;
    const { tags } = req.query;
    try {
        const products = await Product.find({ user: userId, tags }).lean();

        res.render("productos/all-products", { products, dev: config.dev });
    } catch (error) {
        next(error);
    }
}

async function renderEditForm(req, res) {
    const { productId } = req.params;
    const product = await Product.findOne({ _id: productId }).lean();
    if (product.user != req.user.id) {
        req.flash("error_msg", "No tienes permisos");
        return res.redirect("/products");
    }
    res.render("productos/edit-product", { product });
}

async function updateProduct(req, res, next) {
    const { productId } = req.params;
    const { body: product } = req;

    try {
        await Product.updateOne({ _id: productId }, { $set: product });
        req.flash("success_msg", "Product Updated Successfully");
        res.redirect("/products");
    } catch (error) {
        next(error);
    }
}

async function deleteProduct(req, res, next) {
    const { productId } = req.params;

    try {
        await Product.deleteOne({ _id: productId });
        req.flash("success_msg", "Product Deleted Successfully");
        res.redirect("/products");
    } catch (error) {
        next(error);
    }
}

module.exports = {
    renderForm,
    createNewProduct,
    getProducts,
    renderProducts,
    renderEditForm,
    updateProduct,
    deleteProduct,
};
