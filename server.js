require('./config/db');

const app = require('express')();
const UserRouter = require('./api/User');

const port = process.epnv.PORT || 3000;

const bodyParser = require('express').json;
app.use(bodyParser());

app.use('/user', UserRouter);

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})