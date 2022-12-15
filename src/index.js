require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 4000;

// const corsOptions = {
//     origin: process.env.URL
// };

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const apiKeyChecker = require('./middleware/apiKeyChecker');
const user = require('./app/users/routes');
const services = require('./app/services/routes');
const order = require('./app/order/routes');
const sendMail = require('./app/sendMail/routes');
const refreshToken = require('./app/refreshToken/routes');
require('./app/images/routes')(app);

app.use('/user', apiKeyChecker, user);
app.use('/services', apiKeyChecker, services);
app.use('/order', apiKeyChecker, order);
app.use('/refreshtoken', apiKeyChecker, refreshToken);
app.use('/sendmail', apiKeyChecker, sendMail);
app.use('/images', express.static('images'))

app.get('/', (req, res) => { 
    res.send('Hello!!'); 
})

app.get('*', (req, res) =>{
    res.status(404).json('Страница не найдена!')
})

app.listen(port, () => {
    console.log('Server is running on port ' + port);
})


