
const jwt = require('jsonwebtoken')
// const config = require('../config')
const config = process.env;

module.exports = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token']
  console.log(token)
  // decode token
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.SECRET_KEY, function(err, decoded) {
        if (err) {
            return res.status(401).json({"error": true, "message": 'Unauthorized access.' });
        }
      req.decoded = decoded;
      next();
    });
  } else {
    // if there is no token
    // return an error
    return res.status(403).send({
        "error": true,
        "message": 'No token provided.'
    });
  }
}
