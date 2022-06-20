require('dotenv').config({ path: 'src/config/.env' });
import mysql from 'mysql2';
const MYSQL_DATABASE_NAME = process.env.MYSQL_DATABASE_NAME;
const MYSQL_DATABASE_USERNAME = process.env.MYSQL_DATABASE_USERNAME;
const MYSQL_DATABASE_PASSWORD = process.env.MYSQL_DATABASE_PASSWORD;
const MYSQL_DATABASE_HOST = process.env.MYSQL_DATABASE_HOST;
const MYSQL_DATABASE_PORT = process.env.MYSQL_DATABASE_PORT;
export default (async () => {
	try {
		const connection = mysql.createConnection({
			host: MYSQL_DATABASE_HOST,
			port: MYSQL_DATABASE_PORT,
			user: MYSQL_DATABASE_USERNAME,
			password: MYSQL_DATABASE_PASSWORD,
		});
		await connection.promise().query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE_NAME}\`;`);
		console.info(`DB Connection with ${MYSQL_DATABASE_NAME} established successfully.`);
	} catch (error) {
    console.error('Error occured in db connection', error);
	}
})();