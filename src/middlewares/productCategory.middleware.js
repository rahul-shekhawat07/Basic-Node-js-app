import { validation } from "../utils";
export default {
    addCategoryValidation : async (req,res,next) => {
        const categoryData = validation.productCategory.validate(req.body);
        if(categoryData.error){
            res.status(422).json({
                error: true,
                message: categoryData.error.details[0].message
            });
        } else {
            next();
        }
    },
    verifyQueryParams : async (req,res,next) => {
        let err = false;
        let params = ['page','limit','sortBy','search','categoryName','categorySlug','categoryDesc','query'];
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