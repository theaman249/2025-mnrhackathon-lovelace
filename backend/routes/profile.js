const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');

const updates = require('../data/updates');

// Protected route
 router.get('/', verifyToken, (req, res) => {
   res.status(200).json({ message: 'Protected route accessed: Profile' });
 });

//  router.get('/preferences', verifyToken, async (req, res) => {
//     res.status(200).json({ message: 'Protected route accessed: Profile/Preferences' });
//  });

 router.post('/preferences', verifyToken, async(req,res) =>{
   const {id,data} = req.body

   const updateUser = await updates.updatePersonalPreferences(id,data);

   if(updateUser){
      res.status(200).send({
         id: updateUser.id,
         name: updateUser.name,
         surname: updateUser.surname,
         email: updateUser.email
      })
   }
   else{
      res.status(401).send({
         timestamp: new Date().toISOString(),
         message: 'Password Change was unsuccessful', 
      })
   }
 });

module.exports = router;