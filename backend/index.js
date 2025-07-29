require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth');
const profileRoute = require('./routes/profile');
const dashboardRoute = require('./routes/dashboard');

const data = require('./data/queries');
const dataUpdate = require('./data/updates');

app.use(express.json());


app.get('/', (req, res) => {
  res.send('Backend is working');
});

app.use('/auth', authRoutes);
app.use('/profile', profileRoute);
app.use('/dashboard', dashboardRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


app.get('/test', (req, res) => {
  dataUpdate.updatePersonalPreferences(4, {
    name: "rendi",
    surname: "marsh"
  })
  .then(updatedUser => {
    res.status(200).send({
      message: "User updated successfully",
      user: updatedUser
    });
  })
  .catch(err => {
    console.error(err);
    res.status(500).send({ error: "Failed to update user" });
  });
});


app.get('/healthCheck', async(req,res) =>{

  if (await data.healthCheck()) {
    res.status(200).send({
      timestamp: new Date().toISOString(),
      message: 'Service is healthy',
    });
  } 
  else {
    res.status(503).send({
      timestamp: new Date().toISOString(),
      message: 'Service is unavailable',
    });
  }
  
});

module.exports = app;;
