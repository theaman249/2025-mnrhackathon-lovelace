const { Client } = require('pg');
require('dotenv').config();

// Database initialization
(async () => {
    const client = new Client({
        user: process.env.PG_USER_NAME,
        host: process.env.PG_HOST,
        password: process.env.PG_PASSWORD,
        port: process.PG_PORT,
    });

    try {

        console.log(`Running Database script...`);
        console.log(process.env.PG_HOST);

        await client.connect();
        
        const dbName = 'genesis';

        // Check if the database exists
        const result = await client.query(
            `SELECT datname FROM pg_database WHERE datname = $1`, [dbName]
        );

        if (result.rows.length > 0) {
            console.log(`Database "${dbName}" already exists.`);
        } 
        else {
            console.log(`Database "${dbName}" does not exist. Creating...`);
            await client.query(`CREATE DATABASE ${dbName}`);
        }
        
        await client.end(); 

        const dbClient = new Client({
            user: process.env.PG_USER_NAME,
            host: process.env.PG_HOST,
            password: process.env.PG_PASSWORD,
            port: process.PG_PORT,
            database: dbName, // Now connect to "genesis"
        });

        await dbClient.connect();

        // Create tables
        await dbClient.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                surname VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
            );

            CREATE TABLE IF NOT EXISTS notifications (
                timestamp TIMESTAMPTZ DEFAULT NOW(),
                title VARCHAR(255),
                status VARCHAR (255)
            );

            CREATE TABLE IF NOT EXISTS monitored_destinations (
                id SERIAL PRIMARY KEY,
                location VARCHAR(255),
                risk_level VARCHAR(100),
                last_checked TIMESTAMPTZ
            );
            `
        );

        console.log('tables created successfully.');

        await dbClient.end();
        
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1); 
    }
})();