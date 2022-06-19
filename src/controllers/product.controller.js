import { productService } from "../services";
import { errorLogger } from "../utils";

const getProducts = async (req, resp, next) => {
    try {
        resp.status(200).send({
            success: true,
            data: await productService.getProducts(req),
        });
    } catch (error) {
        errorLogger(error.message, req.originalUrl, req.ip);
        next(error);
    }
};
const saveProducts = async (req, resp, next) => {
    try {
        resp.status(200).send({
            success: true,
            data: await productService.saveProduct(req.body, req.params.id),
        });
    } catch (error) {
        errorLogger(error.message, req.originalUrl, req.ip);
        next(error);
    }
};
const deleteProduct = async (req, resp, next) => {
    try {
        resp.status(200).send({
            success: true,
            data: await productService.deleteProduct(req.params.id),
        });
    } catch (error) {
        errorLogger(error.message, req.originalUrl, req.ip);
        next(error);
    }
};
export default { getProducts, saveProducts, deleteProduct };
