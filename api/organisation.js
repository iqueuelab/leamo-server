const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const Organisation = require('../modules/Organisation');

router.get(
  '/',
  async (req, res) => {
    try {
      const orgs = await Organisation.find();
      return res.status(200).send(orgs);
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.post('/',
  [
    check('name', 'Name is required!')
      .not()
      .isEmpty(),
    check('subdomain', 'Subdomain is required!')
      .not()
      .isEmpty(),
    check('address', 'Address is required!')
      .not()
      .isEmpty(),
    check('country', 'Country is required!')
      .not()
      .isEmpty(),
    check('state', 'State is required!')
      .not()
      .isEmpty(),
    check('users', 'Users Count is required!')
      .not()
      .isEmpty(),
    check('gstin', 'GSTIN is required!')
      .not()
      .isEmpty(),
    check('gstin', 'GSTIN is required!')
      .not()
      .isEmpty(),
    check('primaryAdminName', 'Primary Admin Name is required!')
      .not()
      .isEmpty(),
    check('contactNumber', 'Contact Number is required!')
      .not()
      .isEmpty(),
    check('email', 'Email is required!')
      .not()
      .isEmpty(),
    check('endDate', 'End Date is required!')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, subdomain, address, country, users,
      gstin, startDate, endDate, autoRenewal, primaryAdminName,
      contactNumber, email, state
    } = req.body;
    try {
      // See if org exists with same subdomain
      let org = await Organisation.findOne({ subdomain });
      if (org) {
        return res.status(405).json({ errors: [{ msg: 'Organisation with this subdomain already exists' }] });
      }
      org = new Organisation({
        name, subdomain, address, country, users,
        gstin, startDate, endDate, autoRenewal, primaryAdminName,
        contactNumber, email, state
      });
      const newOrg = await org.save().then((org) => org.id);
      const newOrgAdminRegUrl = `${process.env.FRONT_END_URL}/register/org/${newOrg}`;
      console.log(newOrgAdminRegUrl);
      return res.status(200).json({ message: 'Organisation created successfully!!!' });
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.put(
  '/:id',
  [
    check('name', 'Name is required!')
      .not()
      .isEmpty(),
    check('subdomain', 'Subdomain is required!')
      .not()
      .isEmpty(),
    check('address', 'Address is required!')
      .not()
      .isEmpty(),
    check('country', 'Country is required!')
      .not()
      .isEmpty(),
    check('users', 'Users Count is required!')
      .not()
      .isEmpty(),
    check('gstin', 'GSTIN is required!')
      .not()
      .isEmpty(),
    check('gstin', 'GSTIN is required!')
      .not()
      .isEmpty(),
    check('primaryAdminName', 'Primary Admin Name is required!')
      .not()
      .isEmpty(),
    check('contactNumber', 'Contact Number is required!')
      .not()
      .isEmpty(),
    check('email', 'Email is required!')
      .not()
      .isEmpty(),
    check('endDate', 'End Date is required!')
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const { id } = req.params;
    try {
      let org = await Organisation.findById(id);
      if (org) {
        await Organisation.updateOne({ _id: id }, { $set: { ...org._doc, ...req.body } });
        return res.status(200).json({ message: 'Organisation Updated Successfully!' });
      } else {
        return res.status(404).json({ message: "Organisation not found!!!" });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: 'Server Error' });
    }
  }
);

router.delete(
  '/:id',
  async (req, res) => {
    const { id } = req.params;
    try {
      let org = await Organisation.findById(id);
      if (org) {
        await Organisation.deleteOne({ _id: id });
        return res.status(200).json({ message: "Organisation Deleted Successfully!!!" });
      } else {
        return res.status(404).json({ message: "Organisation not found!!!" });
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).json({ message: 'Server Error' });
    }
  }
);

module.exports = router;