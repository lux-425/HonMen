const express = require('express');

const router = express.Router();

const UserModel = require('../models/UserModel');

const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const crypto = require('crypto');

const baseUrl = require('../utils/baseUrl');

const isEmail = require('validator/lib/isEmail');

const options = {
  auth: {
    api_key: process.env.sendGrid_api,
  },
};

const transporter = nodemailer.createTransport(sendGridTransport(options));

// CHECK IF USER EXISTS AND SEND EMAIL TO RESET THE PASSWORD
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;

    if (!isEmail(email)) {
      return res.status(401).send('Invalid email.');
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const token = crypto.randomBytes(32).toString('hex');

    user.resetToken = token;
    user.expireToken = Date.now() + 3600000;

    await user.save();

    const href = `${baseUrl}/reset/${token}`;

    const mailOptions = {
      to: user.email,
      from: 'garcia.luc66@gmail.com',
      subject: "Hello there! Your password's reset request",
      html: `<p>Hi ${user.name
        .split(' ')[0]
        .toString()}, There was a request to reset your password. <a href=${href}>Click this link to reset the password </a>   </p>
      <p>This token is valid for only 1 hour.</p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => err && console.log(err));

    return res.status(200).send('Email sent successfully.');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error.');
  }
});

// VERIFY THE TOKEN AND RESET THE PASSWORD IN THE DATABASE
router.post('/token', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token) {
      return res.status(401).send('Unauthorized.');
    }

    if (password.length < 6)
      return res
        .status(401)
        .send('Password must be atleast 6 characters long.');

    const user = await UserModel.findOne({ resetToken: token });
    if (!user) {
      return res.status(404).send('User not found.');
    }

    if (Date.now() > user.expireToken) {
      return res.status(401).send('Token expired! Please generate a new one.');
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetToken = '';
    user.expireToken = undefined;

    await user.save();

    return res.status(200).send('Password updated.');
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error.');
  }
});

module.exports = router;
