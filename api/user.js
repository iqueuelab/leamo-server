const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');

const User = require('../modules/User');
const Organisation = require('../modules/Organisation');
const { auth } = require('../middleware/auth');

router.get(
  '/getProfile',
  async (req, res) => {
    const { authorization } = req.headers;
    if(!authorization) {
      return res.status(401).send("Unauthorized!!!");
    }
    const token = authorization.split(" ")[1];
    try {
      const data = jwt.verify(token, process.env.JWTSecret);
      const { user: {id} } = data;
      const user = await User.findById(id);
      if (user) {
        let org;
        if(user.role !=='SuperAdmin') {
          org = await Organisation.findById(user._doc.orgId);
        }
        if (user._doc?.password) delete user._doc.password;
        return res.status(200).send({...user._doc, ...org?._doc});
      } else {
        return res.status(400).send('User not found!!!');
      }

    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

router.get(
  '/validateUsername/:username',
  async (req, res) => {
    const { username } = req.params;
    try {
      let user = await User.findOne({ username });
      if (user) {
        return res.status(200).send(user);
      } else {
        return res.status(200).send('User not found!!!');
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
)

router.get(
  '/:id',
  async (req, res) => {
    const { id } = req.params;
    try {
      let user = await User.findById(id);
      if (user?._doc?.password) delete user._doc.password;
      if (user) {
        return res.status(200).send(user);
      } else {
        return res.status(200).send('User not found!!!');
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

router.get(
  '/',
  auth,
  async (req, res) => {
    try {
      const { user: currentUser } = req;
      let users = [];
      if(currentUser.role === 'Admin') {
        users = (await User.find({ orgId: currentUser.orgId }));
        // .filter(user => user.role !== 'Admin');
      } 
      if(currentUser.role === 'SuperAdmin') {
        users = await User.find({ role: 'Admin' });
      }
      if(users.length) {
        const orgIds = users.map(function (user) { return user.orgId });
        const orgs = (await Organisation.find({ founder: { $in: orgIds } }));
        const updatedUsers = users.map((user) => {
          const org = orgs.find((o) => o._doc._id.toString() === user._doc.orgId);
          delete user._doc.password;
          return ({
            ...user._doc,
            orgName: org?.name || '',
          })
        });
        return res.status(200).send(updatedUsers);
      }
      return res.status(200).send(users);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

router.post(
  '/',
  [
    check('firstname', 'First Name is required!')
      .not()
      .isEmpty(),
    check('lastname', 'last Name is required!')
      .not()
      .isEmpty(),
    check('role', 'User role is required!')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid Email!').isEmail(),
    check('phone', 'Contact Number is required!')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { 
      firstname, lastname, email, phone, 
      role, orgId, username, password, manager, department, 
    } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(405).json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = gravatar.url(email, {
        s: 200,
        r: 'pg',
        d: 'mm'
      });

      user = new User({ firstname, lastname, email, phone, role, orgId, avatar, username, password, manager, department,});

      const newUser = await user.save().then((user) => ({ id: user.id, orgId: orgId, role: role }));
      const newUserRegUrl = `${process.env.FRONT_END_URL}/register/${newUser.role}/${newUser.orgId}/${newUser.id}`;
      console.log(newUserRegUrl);
      return res.status(200).send('User created successfully!!!');
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

router.put(
  '/:id',
  async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      console.log(user, id);
      if (user) {
        const mutatedValues = { ...user._doc, ...req.body }
        if(req.body.password) {
          // Encrypt password
          const salt = await bcrypt.genSalt(10);
          user._doc.password = await bcrypt.hash(req.body.password, salt);
          delete req.body.password;
        }
        await User.updateOne({ _id: id }, { $set: { ...user._doc, ...req.body } }).then(res => console.log(res)).catch(e => console.log(e));
        return res.status(200).send('User Updated Successfully!');
      } else {
        return res.status(404).send("User not found!!!");
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

router.delete(
  '/:id',
  async (req, res) => {
    const { id } = req.params;
    try {
      let user = await User.findById(id);
      if (user) {
        await User.deleteOne({ _id: id });
        return res.status(200).send("User Deleted Successfully!!!");
      } else {
        return res.status(404).send("User not found!!!");
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
