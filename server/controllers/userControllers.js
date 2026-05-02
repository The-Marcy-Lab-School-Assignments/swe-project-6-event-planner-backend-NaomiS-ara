const userModel = require('../models/userModel');

const update = async (req, res) => {
  const { user_id } = req.params;

  if (!req.session.userId) {
    return res.status(401).send({ error: "Not logged in" });
  }

  if (req.session.userId != user_id) {
    return res.status(403).send({ error: "Forbidden" });
  }

  if (!req.body.password) {
    return res.status(400).send({ error: "Missing password" });
  }

  const user = await userModel.updatePassword(user_id, req.body.password);

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  res.send(user);
};

const remove = async (req, res) => {
  const { user_id } = req.params;

  if (!req.session.userId) {
    return res.status(401).send({ error: "Not logged in" });
  }

  if (req.session.userId != user_id) {
    return res.status(403).send({ error: "Forbidden" });
  }

  const user = await userModel.remove(user_id);

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  res.send(user);
};

module.exports = { update, remove };