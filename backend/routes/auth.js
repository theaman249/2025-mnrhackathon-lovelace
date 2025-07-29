const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const data = require('../data/queries');

// Mock model 
// const users = [
//   {
//     _id: '12345',
//     firstname: 'Jane',
//     lastname: 'Doe',
//     email: 'janedoe@gmail.com',
//     password: '$2b$10$kqiaOX3U0WPpeBEGG40Vp.ZB/yXGIlPEBk.U3fENbnhxZ3nqQSdnm'
//   }
// ];

router.post('/login', async (req, res) => {
    //console.log('Login request received:', req.body);
    try {
      const { email, password } = req.body;

      const user = await data.getUser(email);

      //console.log(user);

      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ error: 'Authentication failed: User not found' });
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        console.log('Incorrect password:', password);
        return res.status(401).json({ error: 'Authentication failed: Incorrect Password' });
      }
      
      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',});

      res.status(200).json({ token });

    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
        console.log(error);
    }
});

router.post('/logout', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});


module.exports = router;