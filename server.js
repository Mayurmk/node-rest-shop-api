const http = require('http');
const app = require('./app');
const PORT = process.env.PORT || 3000;
// const moment = require('moment');
const hello = 'hiii';
const server = http.createServer(app);

server.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
