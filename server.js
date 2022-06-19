import express, { json, urlencoded } from 'express';
import cors from 'cors';
import routes from './src/routes';

const server = express();
require('dotenv').config({ path: 'src/config/.env' });
const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 5000;
const BASE_API_URL = `http://${HOST}:${PORT}${'/api/v1'}`;

server.use(json());
server.use(urlencoded({ extended: true }));
server.use(cors({ origin: true, credentials: true }));
server.use('/api/v1/products', routes.productRoute);
server.use('/api/v1/productcategories', routes.productCategoryRoute);

server.all('*', (req, res, next) => {
    const err = new Error(`Requested URL ${req.path} not Found!`);
    err.statusCode = 404;
    next(err);
});

server.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: true,
        message: err.message
    });
});

server.listen(PORT, () => {
    console.info('API Running at');
    console.info(`${'localhost:'} ${BASE_API_URL}`);
    console.info(`${'Products:'} ${`${BASE_API_URL}/products`}`);
    console.info(`${'ProductCategories:'} ${`${BASE_API_URL}/productcategories`}`);
});