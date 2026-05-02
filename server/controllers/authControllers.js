const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');

const register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send({ error: "Missing fields" });
  }

  try {
    const user = await userModel.create(username, password);
    req.session.userId = user.user_id;
    res.status(201).send(user);
  } catch (err) {
    res.status(409).send({ error: "Username taken" });
  }
};


const login = async (req, res) => {
  const { username, password } = req.body;

  const user = await userModel.findByUsername(username);

  if (!user) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  const match = await bcrypt.compare(password, user.password_hash);

  if (!match) {
    return res.status(401).send({ error: "Invalid credentials" });
  }

  req.session.userId = user.user_id;

  res.send({ user_id: user.user_id, username: user.username });
};

const me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send(null);
  }

  const user = await userModel.findById(req.session.userId);
  res.send(user);
};

const logout = (req, res) => {
  req.session = null;
  res.send({ message: "Logged out." });
};

module.exports = { register, login, me, logout };
