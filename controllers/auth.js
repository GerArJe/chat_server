const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');

const createUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ ok: false, msg: 'Email already exists' });
    }

    const user = new User(req.body);

    // encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    res.json({
      ok: true,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error server' });
  }
};

module.exports = { createUser };
