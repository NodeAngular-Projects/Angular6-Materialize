const  bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const keys = require('../config/keys');
const errorHandler = require('../utils/errorHandler');

module.exports.login = async function(req, res) {
  const candidate = await User.findOne({
    email: req.body.email});

    if (candidate) {
      // Check password, user was find
      const passwordResult = bcryptjs.compareSync(req.body.password, candidate.password);

      if (passwordResult) {
        // passwords are equal, generate Token
        const token = jwt.sign({
          email: candidate.email, 
          userId: candidate._id
        }, keys.jwt, { expiresIn: 60 * 60});

        res.status(200).json({
          token: `Bearer ${token}`,
          message: 'You are successfully log in.'
        });
      } else {
        // diff passwords, handle error
        res.status(401).json({
          message: 'Your email or password was incorrect!'
        });
      }

    } else {
      // Handle error, no such user
      res.status(404).json({
        message: 'Your email or password was incorrect!'
      });
    }
}

module.exports.register = async function(req, res) {
  const candidate = await User.findOne(
    {email: req.body.email});

  if (candidate) {
    // There is the same user-email -> send error message
    res.status(409).json({
      message: 'This email address is already busy! Try another one email.'
    });
  } else {
    // create user
    const salt = bcryptjs.genSaltSync(10);
    const password = req.body.password;

    const user = new User({
      email: req.body.email,
      password: bcryptjs.hashSync(password, salt)
    });

    try {
      await user.save();
      res.status(201).json({
        user: user,
        message: 'User created successfully!' 
      });
    } catch (err) {
      // error handling
      errorHandler(res, err);
    }    
  }
} 