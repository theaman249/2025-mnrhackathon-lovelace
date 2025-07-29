const db = require('../commons/conn'); 
const queries = require('./queries');
const bcrypt = require('bcrypt');

/**
 * preferences is an object of type 
 * {
 *  name:Text,
 *  surname:Text,
 *  email : Text
 * }
 */
async function updatePersonalPreferences(userId, preferences) {
  const allowedFields = ['name', 'surname', 'email'];
  const setClauses = [];
  const values = [];
  let i = 1;

  for (const key of allowedFields) {
    if (preferences[key]) {
      setClauses.push(`${key} = $${i}`);
      values.push(preferences[key]);
      i++;
    }
  }

  if (setClauses.length === 0) {
    throw new Error('No fields to update');
  }

  // Add user ID as the last value for the WHERE clause
  values.push(userId);

  const query = `
    UPDATE users
    SET ${setClauses.join(', ')}
    WHERE id = $${i}
    RETURNING *;
  `;

  try {
    const { rows } = await db.query(query, values);
    return rows[0]; // Return the updated user
  } catch (err) {
    console.error('Update failed:', err);
    throw err;
  }
}


// async function updatePassword(email,currentPassword,newPassword,confirmPassword)
// {
//     const user = await queries.getUser(email);

//     if(user){
//         const passwordMatch = await bcrypt.compare(currentPassword, newPassword);

//         if (!passwordMatch) {
//             return {
//                 timestamp: new Date().toISOString,
//                 message: "passwords do not match"
//             }
//         }
//         else if(confirmPassword != newPassword){
//             return {
//                 timestamp: new Date().toISOString,
//                 message: "passwords do not match"
//             }
//         }
        
//     }
//     else{
//         return {
//             timestamp: new Date().toISOString(),
//             message: 'user does not exist'
//         }
//     }
// }

module.exports = {
    updatePersonalPreferences
};