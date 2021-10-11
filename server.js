const http = require('http');
const app = require('./app');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// either using port from heroku or 3000
const port = process.env.PORT || 3000;

const server = http.createServer();

app.listen(port, () => {
  console.log(`App running on port: ${port}...`);
});
