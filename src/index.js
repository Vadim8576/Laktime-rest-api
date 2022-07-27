require('dotenv').config();// для работы с .env
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const corsOptions = {
    origin: process.env.URL
};

app.use(cors());

const port = process.env.PORT || 4000
// parse requests of content-type - application/json
app.use(bodyParser.json());

/* parse requests of content-type - application/x-www-form-urlencoded */
// app.use(bodyParser.urlencoded({ extended: true }));


require('./routes/imageRoutes')(app);
app.use('/images', express.static('images'))

const apiKeyChecker = require('./middleware/apiKeyChecker');

const user = require('./routes/usersRoutes');
const price = require('./routes/priceRoutes');
const order = require('./routes/orderRoutes');
const sendMail = require('./routes/mailRoutes');
const refreshToken = require('./routes/refreshTokenRoutes');

app.use('/user', apiKeyChecker, user);
app.use('/price', apiKeyChecker, price);
app.use('/order', apiKeyChecker, order);
app.use('/token', apiKeyChecker, refreshToken);
app.use('/sendmail', apiKeyChecker, sendMail);


app.get('/', (req, res) => { 
    res.send('Hello!!'); 
})

app.get('*', (req, res) =>{
    res.status(404).json('Страница не найдена!')
  });


app.listen(port, () => {
    console.log('Server is running on port ' + port);
})


