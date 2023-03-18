const express = require('express');
const dotenv = require('dotenv')
const router = require('./Routes/Route');
dotenv.config();
const app = express();
//view engine
app.set('view engine','ejs');
app.use('/assets', express.static('assets'));


const port = process.env.PORT || 4000;


//Middleare
app.use('/', router)

app.listen(port, () => console.log(`server is running at ${port}`));

