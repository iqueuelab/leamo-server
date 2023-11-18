const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const Course = require('../modules/Course');
const { auth } = require('../middleware/auth');

router.get(
  '/',
  auth,
  async (req, res) => {
    const { user: currentUser } = req;
    let courses = [];
    try {
      courses = await Course.find();
      if (currentUser.role === 'Admin') {
        courses = courses.filter(course => {
          return currentUser.orgCourses.includes(course.id) || currentUser.orgId === course.orgId;
        });
      }
      if (currentUser.role === 'SuperAdmin') {
        courses = courses.filter(course => !course.orgId);
      }
      return res.status(200).send(courses);
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

router.get(
  '/:id',
  async (req, res) => {
    const { id } = req.params;
    try {
      let course = await Course.findById(id);
      if (course) {
        return res.status(200).send(course);
      } else {
        return res.status(200).send('Course not found!!!');
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

router.post(
  '/',
  [
    check('name', 'Course Name is required!')
      .not()
      .isEmpty(),
    check('type', 'Course Type is required!')
      .not()
      .isEmpty(),
    check('author', 'Author is required!')
      .not()
      .isEmpty(),
    check('duration', 'Course Duration is required!').not().isEmpty(),
    check('city', 'City is required!')
      .not()
      .isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { name, type, author, duration, city } = req.body;
    try {
      // See if user exists
      let course = await Course.findOne({ name });
      if (course) {
        return res.status(405).json({ errors: [{ msg: 'Course with the same name already exists! Please try with other name.' }] });
      }
      
      course = new Course({ name, type, author, duration, city  });
      await course.save().then(res => console.log(res)).catch(e => console.log(e));
      return res.status(200).send('Course created successfully!!!');
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
      let course = await Course.findById(id);
      if (course) {
        await Course.updateOne({ _id: id }, { $set: { ...course._doc, ...req.body } });
        return res.status(200).send("Course Updated Successfully!");
      } else {
        return res.status(404).send("Course not found!!!");
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send("Server Error");
    }
  }
);

router.delete(
  '/:id',
  async (req, res) => {
    const { id } = req.params;
    try {
      let course = await Course.findById(id);
      if (course) {
        await Course.deleteOne({ _id: id });
        return res.status(200).send("Course Deleted Successfully!!!");
      } else {
        return res.status(404).send("Course not found!!!");
      }
    } catch (err) {
      console.log(err.message);
      return res.status(500).send('Server Error');
    }
  }
);

module.exports = router;
