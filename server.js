const http = require('http');
const app = require('./config/app');
const chalk = require('chalk');








const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  console.log(chalk.blue('Running on port ' + port));
});