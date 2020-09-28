const app = require('./server')
const DataBase = require('./config/db');
const { config } = require('./config/index');

// Connect to Database
DataBase.connect();

// server

const host = '0.0.0.0';
const port = config.port;
app.listen(port, host, () => {
    console.log(`El servidor esta funcionando en el puerto: ${port}`);
})
