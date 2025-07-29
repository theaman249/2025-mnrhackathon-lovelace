const { Client } = require('pg');

// Database initialization
(async () => {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        password: 'admin',
        port: 5432
    });

    try {

        console.log(`Running Database script...`);

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
            user: 'postgres',
            host: 'localhost',
            password: 'admin',
            port: 5432,
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
            `
        );

        console.log('Table "users" created successfully.');

        await dbClient.end();
        
        
    } catch (error) {
        console.error('Error:', error);
        process.exit(1); 
    }
})();