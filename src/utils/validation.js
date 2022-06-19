import joi from "joi";
export default {
    products: joi.object({
        productName: joi.string().required(),
        categoryId: joi.number().required(),
        productSlug: joi.allow(),
        productDesc: joi.string(),
        isActive: joi.boolean().required()
    }),
    productCategory: joi.object({
        categoryName: joi.string().required(),
        categoryDesc: joi.string(),
        categorySlug: joi.allow(),
        isActive: joi.boolean().required()
    })
};
