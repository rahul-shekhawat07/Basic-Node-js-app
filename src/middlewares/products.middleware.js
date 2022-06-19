import { validation } from "../utils";
export default {
    addProductValidation : async (req,res,next) => {
        const productData = validation.products.validate(req.body);
        if(productData.error){
            res.status(422).json({
                error: true,
                message: productData.error.details[0].message
            });
        } else {
            next();
        }
    },
    verifyQueryParams : async (req,res,next) => {
        let err = false;
        let params = ['page','limit','sortBy','search','productName','productSlug','categoryId','query'];
        Object.keys(req.query).every(key => {
            if (params.indexOf(key) === -1) err = true;
            if(!err) return true;
        });
        if(err){
            res.status(400).json({
                error: true,
                message: "Invalid query parameters found."
            });
        } else {
            next();
        }
    }
};