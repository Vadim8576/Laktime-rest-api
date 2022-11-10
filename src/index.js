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

require('./app/images/imageRoutes')(app);
const apiKeyChecker = require('./middleware/apiKeyChecker');
const user = require('./app/users/usersRoutes');
const price = require('./app/price/priceRoutes');
const order = require('./app/order/orderRoutes');
const sendMail = require('./app/sendMail/mailRoutes');
const refreshToken = require('./app/token/refreshTokenRoutes');

app.use('/user', apiKeyChecker, user);
app.use('/price', apiKeyChecker, price);
app.use('/order', apiKeyChecker, order);
app.use('/token', apiKeyChecker, refreshToken);
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


