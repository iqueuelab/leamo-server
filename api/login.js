const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../modules/User');

const { check, validationResult } = require('express-validator');
const Organisation = require('../modules/Organisation');

router.post('/',
  [
    check('username', 'Username is Required!').not().isEmpty(),
    check('password', 'Password is required!').not().isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(401).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    try {
      // See if user exists
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };
      delete user._doc.password;
      let organisation;
      if(user.role !== 'SuperAdmin') {
        organisation = await Organisation.findById(user._doc.orgId);
      }
      jwt.sign(
        payload,
        process.env.JWTSecret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          return res.json({ token: `Bearer ${token}`, role: user.role, subdomain: organisation?._doc?.subdomain || null });
        }
      );
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
