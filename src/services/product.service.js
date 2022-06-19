import db from "../models";
import { errorHandler } from "../utils";
import { Op } from "sequelize";

const getProducts = async (req) => {
    let productsArr, options, id;
    id = req.params.id;
    options = await getSearchOptions(req);
    options.include = [{model:db.ProductCategory,as:'categoryDetails'}];
    if (id) productsArr = await db.Products.findAndCountAll({ where: { productId: id } });
    else productsArr = await db.Products.findAndCountAll(options);
    if (productsArr.count > 0) {
        return { found: true, totalCount: productsArr.count, rows: productsArr.rows };
    } else {
        return { found: false, rows: "Rows not found" };
    }
}
const getSearchOptions = async (req) => {
    let page, limit, offset, sortBy, productName, productSlug, productDesc, query;
    let options = {};
    page = req.query.page;
    limit = req.query.limit;
    sortBy = req.query.sortBy;
    let search = req.query.search || false;
    if (page) {
        limit = parseInt(limit) || 5;
        offset = (page - 1) * limit;
        options = { limit: limit, offset: offset }
    }
    if (sortBy) {
        if (sortBy.toUpperCase() == 'A') sortBy = "ASC";
        if (sortBy.toUpperCase() == 'D') sortBy = "DESC";
        options.order = [['productId', sortBy]];
    }
    if (search) {
        productName = req.query.productName;
        productSlug = req.query.productSlug;
        productDesc = req.query.productDesc;
        query = req.query.query;
        let params = [];
        let queryParam = [];
        if (productName) params.push({ productName: productName });
        if (productSlug) params.push({ productSlug: productSlug });
        if (productDesc) params.push({ productDesc: productDesc });
        options.where = { [Op.and]: params };
        if (query) {
            queryParam.push({ productName: { [Op.like]: "%" + query + "%" } }, { productSlug: { [Op.like]: "%" + query + "%" } }, { productDesc: { [Op.like]: "%" + query + "%" } });
            options.where = { [Op.and]: params, [Op.or]: queryParam };
        }
    }
    return options;
}
const checkSlug = async (body, id = null) => {
    let productTitle, slug, options;
    productTitle = body.productName;
    slug = body.productSlug;
    if (!slug && id) {
        let products = await db.Products.findByPk(id, { attributes: ['productSlug'] });
        slug = products.productSlug;
    } else {
        if (!slug) slug = productTitle;
        slug = slug.toLowerCase().split(" ").filter(Boolean).join("-");
        options = { where: { productSlug: slug } };
        if (id) options = { where: { [Op.and]: [{ productSlug: slug }, { productId: { [Op.ne]: id } }] } };
        let slugExists = await db.Products.findOne(options, { attributes: ['productId'] });
        if (slugExists) slug = slug + "-" + Math.floor(Math.random() * 1000).toString();
    }
    body.productSlug = slug;
    return body;
};
const verifyCategory = async (body) => {
    let categoryId = body.categoryId;
    let cateExists = await db.ProductCategory.findByPk(categoryId, { attributes: ['categoryId'] });
    if (!cateExists) throw new errorHandler("Category not found please enter valid category id.", 400);
};
const saveProduct = async (body, id = null) => {
    body = await checkSlug(body, id);
    await verifyCategory(body);
    if (id) {
        return await db.Products.update(body, { where: { productId: id } }).then(() => {
            return "Product updated successfully.";
        }).catch(err => {
            throw new errorHandler(err.errors[0].message, 422);
        });
    } else {
        return await db.Products.create(body).then(() => {
            return "Product added successfully.";
        }).catch(err => {
            throw new errorHandler(err.errors[0].message, 422);
        });
    }
}
const deleteProduct = async (id) => {
    let exists = await db.Products.findByPk(id, { attributes: ['productId'] });
    if (!exists) throw new errorHandler("Invalid product Id.", 400);
    await db.Products.destroy({ where: { productId: id } });
    return "Product deleted successfully."
}
export default { getProducts, saveProduct, deleteProduct };