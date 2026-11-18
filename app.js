const express = require('express');
const { sequelize } = require('./models');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();
app.use(express.json());
app.use('/users', userRoutes);
app.use('/posts', postRoutes);

const PORT = process.env.PORT || 3002;
let server;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connected to MySQL');
    await sequelize.sync();
    console.log('Models synced: users, posts');
  } catch (err) {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  }

  server = app.listen(PORT, (err) => {
    if (err) {
      console.error(`Failed to start server: ${err.message}`);
      process.exit(1);
    }
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

process.on('SIGINT', async () => {
  if (server) server.close();
  await sequelize.close();
  console.log('Database connection closed');
  process.exit(0);
});
