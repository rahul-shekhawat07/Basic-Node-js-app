import { productCategoryService } from "../services";
import { errorLogger } from "../utils";

const getProductCategories = async (req, resp, next) => {
    try {
        resp.status(200).send({
            success: true,
            data: await productCategoryService.getProductCategories(req),
        });
    } catch (error) {
        errorLogger(error.message, req.originalUrl, req.ip);
        next(error);
    }
};
const saveProductCategory = async (req, resp, next) => {
    try {
        resp.status(200).send({
            success: true,
            data: await productCategoryService.saveProductCategory(req.body, req.params.id),
        });
    } catch (error) {
        errorLogger(error.message, req.originalUrl, req.ip);
        next(error);
    }
};
const deleteProductCategory = async (req, resp, next) => {
    try {
        resp.status(200).send({
            success: true,
            data: await productCategoryService.deleteProductCategory(req.params.id),
        });
    } catch (error) {
        errorLogger(error.message, req.originalUrl, req.ip);
        next(error);
    }
};
export default { getProductCategories, saveProductCategory, deleteProductCategory };
