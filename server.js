require('dotenv').config()

const express = require('express')
const compression = require('compression')

const app = express();
const router = express.Router();
const auth = require('./Config/Auth.Config')

const ApiRoutes = require('./Routes/API.Routes')(router, auth)

app.use(compression());
app.use(express.urlencoded());
app.use(express.json());
app.set("trust proxy", 1); // trust first proxy

app.use('/api/v1/', ApiRoutes)

app.set('port', process.env.PORT || 8080);
app.listen(app.get('port'), (err)=>{
    console.log(`${process.env.APP_NAME} listening on port ${process.env.PORT}`);
});