const app = require('./app');
const { PORT } = require('./config');

const PORT = PORT || 3000;

//start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
