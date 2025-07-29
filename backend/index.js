require('dotenv').config();
const express = require('express');
const app = express();
const port = 3000;
const authRoutes = require('./routes/auth');
const profileRoute = require('./routes/profile');
const dashboardRoute = require('./routes/dashboard');

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
