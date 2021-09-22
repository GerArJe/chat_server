const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

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

    // Generate JWT
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error server' });
  }
};

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const userDB = await User.findOne({ email });
    if (!userDB) {
      return res.status(400).json({
        ok: false,
        msg: 'No email found',
      });
    }

    const validPassword = bcrypt.compareSync(password, userDB.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: 'invalid password',
      });
    }

    // Generate JWT
    const token = await generateJWT(userDB.id);

    return res.json({
      ok: true,
      user: userDB,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, msg: 'Error server' });
  }
};

const renewToken = async (req, res = response) => {
  return res.json({
    ok: true,
    uid: req.uid,
  });
};

module.exports = { createUser, login, renewToken };
