const app = require('./app');
//const { PORT } = require('./config');

const PORT = process.env.PORT || 4000;

//start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
