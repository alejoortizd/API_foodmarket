const productsMocks = require('../utils/mocks/products');
const MongoLib = require('../lib/mongo');

class ProductsService {
    constructor () {
        this.collection = 'products';
        this.mongoDB = new MongoLib();
    }

    async getProducts({ tags }) {
        const query = tags && { tags: { $in: tags } };
        const products = await this.mongoDB.getAll(this.collection, query);

        return products || [];
    }

    // async getProduct({ productId }) {
    //     const product = await this.mongoDB.getProduct(this.collection, productId)
    //     return product || {};
    // }

    // async createProduct({ product }) {
    //     const createProduct = await this.mongoDB.createProduct(this.collection, product)
    //     return createProduct;
    // }

    // async updateProduct({ productId, dataProduct }) {
    //     const updateProduct = await this.mongoDB.updateProduct(this.collection, productId, dataProduct)
    //     return updateProduct;
    // }

    // async deleteProducts({ productId }) {
    //     const deleteProduct = await this.mongoDB.deleteProduct(this.collection, productId)
    //     return deleteProduct;
    // }

    // patchProduct({ productId, dataProduct }) {
    //     return Promise.resolve(productsMocks[0]);
    // }
}

module.exports = ProductsService