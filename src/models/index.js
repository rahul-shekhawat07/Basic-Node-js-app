
'use strict';
require('dotenv').config({ path: 'src/config/.env' });
import dbConnection from '../config/dbConnection';
import { readdirSync } from 'fs';
import { basename as _basename, join } from 'path';
import Sequelize, { DataTypes } from 'sequelize';
const basename = _basename(__filename);
const db = {};

let sequelize = new Sequelize(process.env.MYSQL_DATABASE_NAME, process.env.MYSQL_DATABASE_USERNAME, process.env.MYSQL_DATABASE_PASSWORD, {
    host: process.env.MYSQL_DATABASE_HOST,
    dialect: process.env.MYSQL_DATABASE_DIALECT,
});

readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf('.') !== 0 && file !== basename && file.split('.')[1] === 'model';
	})
	.forEach((file) => {
		const model = require(join(__dirname, file)).default(sequelize, DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});
dbConnection.then(()=>{
    sequelize.sync();
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;