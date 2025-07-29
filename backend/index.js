require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth');
const profileRoute = require('./routes/profile');
const dashboardRoute = require('./routes/dashboard');

const data = require('./data/queries');

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


// app.get('/getAllUsers', async(req,res) =>{
//   //console.log(data.getAllUsers());

//   res.status(200).send(await data.getAllUsers())
// });

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
