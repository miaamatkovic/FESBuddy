import mysql from "mysql2";

export const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:REMOVED_DB_PASSWORD,
    database:"fesbuddy",
    authPlugins: {
        caching_sha2_password: mysql.authPlugins.cachingSha2Password
    }
});