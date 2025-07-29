const {Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    password: 'admin',
    port: 5432,
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