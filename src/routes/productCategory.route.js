import express from 'express';
import { productCategoryController } from '../controllers';
import { productCategoryMiddleware } from '../middlewares';
export default express
    .Router()
    .get('/',productCategoryMiddleware.verifyQueryParams,productCategoryController.getProductCategories)
    .get('/edit/:id',productCategoryController.getProductCategories)
    .post('/add',productCategoryMiddleware.addCategoryValidation,productCategoryController.saveProductCategory)
    .put('/edit/:id',productCategoryMiddleware.addCategoryValidation,productCategoryController.saveProductCategory)
    .delete('/delete/:id',productCategoryController.deleteProductCategory);