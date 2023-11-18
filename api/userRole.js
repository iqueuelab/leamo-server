const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');
const UserRole = require('../modules/UserRole');

router.get(
  '/',
  async (req, res) => {
    try {
      let userRoles = await UserRole.find();
      return res.status(200).send(userRoles);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

router.post(
  '/',
  [
    check('role', 'User Role is required!')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { role } = req.body;
    try {
      let userRole = await UserRole.findOne({ role });
      if (userRole) {
        return res.status(400).json({ errors: [{ msg: 'User Role already exists' }] });
      }
      userRole = new UserRole({ role });
      await userRole.save();
      return res.status(200).send('User Role Created Successfully!');
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
      let userRole = await UserRole.findById(id);
      if (userRole) {
        await UserRole.updateOne({ _id: id }, { $set: { ...userRole.doc, ...req.body } });
        return res.status(200).send('User Role Updated Successfully!');
      } else {
        return res.status(404).send("User Role not found!!!");
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
      let userRole = await UserRole.findOne(id);
      if (userRole) {
        await UserRole.deleteOne({ _id: id });
        return res.status(200).send("User Role Deleted Successfully!!!");
      } else {
        return res.status(404).send("User Role not found!!!");
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
