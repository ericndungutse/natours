const mongoose = require('mongoose');
const dotenv = require('dotenv');

// HANDLING UNDEFINED VARIABLES
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  console.log('UNCOUGHT EXCEPTION! Shutting down...');
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

// DABABASE CONNECTION
mongoose
  .connect(process.env.LOCAL_DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then((con) => console.log('Database Connection Successful!'));

//START THE SERVER
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

// ASYNCHRONOUS CODES THAT AREHANDLED(REJECTED PROMISES)
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
