const db = require('../commons/conn'); 


async function getUser(email){
    const query = 'SELECT * FROM users WHERE email = $1';

    try {
        const { rows } = await db.query(query, [email]);

        return rows[0]; // return single user
    } catch (error) {
        console.error('Error fetching user:', error);
        throw error;
    }
}

async function getAllUsers() {

    const query = 'SELECT * FROM users';

    try {
        const { rows } = await db.query(query);

        return rows;

    } catch (error) {
        console.error('Error querying the database:', error);
    }
}


async function healthCheck() {

    const dbName = "genesis";

    try{
        
        const result = await db.query(
            `SELECT datname FROM pg_database WHERE datname = $1`, [dbName]
        );

        if (result.rows.length > 0) {
            console.log(`Database "${dbName}" exists.`);
            return true;
        } 
        else {
            console.log(`Database "${dbName}" does not exist.`);
            return false
        }
    }
    catch(error){
        console.error('Error querying the database:', error);
        return false;
    }
}


module.exports = {
    getUser,
    getAllUsers,
    healthCheck
};

