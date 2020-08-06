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
    renderProducts,
    renderEditForm,
    updateProduct,
    deleteProduct,
};
