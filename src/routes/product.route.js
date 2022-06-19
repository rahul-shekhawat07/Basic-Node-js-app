import express from 'express';
import { productController } from '../controllers';
import { productsMiddleware } from '../middlewares';
export default express
    .Router()
    .get('/',productsMiddleware.verifyQueryParams,productController.getProducts)
    .get('/edit/:id',productController.getProducts)
    .post('/add',productsMiddleware.addProductValidation,productController.saveProducts)
    .put('/edit/:id',productsMiddleware.addProductValidation,productController.saveProducts)
    .delete('/delete/:id',productController.deleteProduct);