const {Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: process.env.PG_USER_NAME,
    host: process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    port: process.PG_PORT,
    database: 'genesis'
});

(async () => {
    try {

        await client.connect();

        const res = await client.query(`SELECT * FROM users`);

        if (res.rows.length > 0) {
            console.log("entries already exist");
            await client.end();
            process.exit(0);
        }

        // Insert default users
        await client.query(`
            INSERT INTO users
                (name, surname, email, password)
            VALUES
                ('Jensen', 'Huang', 'jensen@workbench.co.za', 'Password@123'),
                ('Ada', 'Lovelace', 'ada@workbench.co.za', 'Password@123'),
                ('Stephan', 'Grunner', 'profg@workbench.co.za', 'Password@123'),
                ('Rendani', 'Krugger', 'rendi@workbench.co.za', 'Password@123');
                ('Jane', 'Doe', 'jane@atlas.co.za', '$2b$10$kqiaOX3U0WPpeBEGG40Vp.ZB/yXGIlPEBk.U3fENbnhxZ3nqQSdnm');
        `);

        const result = await client.query(`SELECT * FROM users`);

        if (result.rows.length > 0) {
            console.log("entries were successfully inserted");
        } else {
            console.log("could not insert entries into the database");
        }
        
    } catch (error) {
        console.error('Error connecting to the database:', error);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.end();
    }

})();