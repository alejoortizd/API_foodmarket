const app = require('./server')
const DataBase = require('./config/db');

// Connect to Database
DataBase.connect();

// server
const server = app.listen(app.get('port'), () => {
    console.log(`Listen http://localhost:${server.address().port}`);
})