import db from "../models";
import { errorHandler } from "../utils";
import { Op } from "sequelize";

const getProductCategories = async (req) => {
    let categoryArr, options, id;
    id = req.params.id;
    options = await getSearchOptions(req);
    options.include = [{model:db.Products,as:'productDetails'}];
    if (id) categoryArr = await db.ProductCategory.findAndCountAll({ where: { categoryId: id } });
    else categoryArr = await db.ProductCategory.findAndCountAll(options);
    if (categoryArr.count > 0) {
        return { found: true, totalCount: categoryArr.count, rows: categoryArr.rows };
    } else {
        return { found: false, rows: "Rows not found" };
    }
}
const getSearchOptions = async (req) => {
    let page, limit, offset, sortBy, categoryName, categorySlug, categoryDesc, query;
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
        options.order = [['categoryId', sortBy]];
    }
    if (search) {
        categoryName = req.query.categoryName;
        categorySlug = req.query.categorySlug;
        categoryDesc = req.query.categoryDesc;
        query = req.query.query;
        let params = [];
        let queryParam = [];
        if (categoryName) params.push({ categoryName: categoryName });
        if (categorySlug) params.push({ categorySlug: categorySlug });
        if (categoryDesc) params.push({ categoryDesc: categoryDesc });
        options.where = { [Op.and]: params };
        if (query) {
            queryParam.push({ categoryName: { [Op.like]: "%" + query + "%" } }, { categorySlug: { [Op.like]: "%" + query + "%" } }, { categoryDesc: { [Op.like]: "%" + query + "%" } });
            options.where = { [Op.and]: params, [Op.or]: queryParam };
        }
    }
    return options;
}
const checkSlug = async (body, id = null) => {
    let categoryTitle, slug, options;
    categoryTitle = body.categoryName;
    slug = body.categorySlug;
    if (!slug && id) {
        let category = await db.ProductCategory.findByPk(id, { attributes: ['categorySlug'] });
        slug = category.categorySlug;
    } else {
        if (!slug) slug = categoryTitle;
        slug = slug.toLowerCase().split(" ").filter(Boolean).join("-");
        options = { where: { categorySlug: slug } };
        if (id) options = { where: { [Op.and]: [{ categorySlug: slug }, { categoryId: { [Op.ne]: id } }] } };
        let slugExists = await db.ProductCategory.findOne(options, { attributes: ['categoryId'] });
        if (slugExists) slug = slug + "-" + Math.floor(Math.random() * 1000).toString();
    }
    body.categorySlug = slug;
    return body;
};
const saveProductCategory = async (body, id = null) => {
    body = await checkSlug(body, id);
    if (id) {
        return await db.ProductCategory.update(body, { where: { categoryId: id } }).then(() => {
            return "Category updated successfully.";
        }).catch(err => {
            throw new errorHandler(err.errors[0].message, 422);
        });
    } else {
        return await db.ProductCategory.create(body).then(() => {
            return "Category added successfully.";
        }).catch(err => {
            throw new errorHandler(err.errors[0].message, 422);
        });
    }
}
const deleteProductCategory = async (id) => {
    let exists = await db.ProductCategory.findByPk(id, { attributes: ['categoryId'] });
    if (!exists) throw new errorHandler("Invalid Category Id.", 400);
    await db.ProductCategory.destroy({ where: { categoryId: id } });
    return "Category deleted successfully."
}
export default { getProductCategories, saveProductCategory, deleteProductCategory };