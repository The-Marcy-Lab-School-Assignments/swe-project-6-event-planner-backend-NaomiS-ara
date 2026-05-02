const eventModel = require('../models/eventModel');

const list = async (req, res) => {
  const events = await eventModel.list();
  res.send(events);
};

const create = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: "Not logged in" });
  }

  const event = await eventModel.create(req.body, req.session.userId);
  res.status(201).send(event);
};


const update = async (req, res) => {
  const event = await eventModel.findById(req.params.event_id);

  if (!req.session.userId) {
    return res.status(401).send({ error: "Not logged in" });
  }

  if (!event) {
    return res.status(404).send({ error: "Event not found" });
  }

  if (event.user_id !== req.session.userId) {
    return res.status(403).send({ error: "Forbidden" });
  }

  const updated = await eventModel.update(req.params.event_id, req.body);
  res.send(updated);
};

const remove = async (req, res) => {
  const event = await eventModel.findById(req.params.event_id);

  if (!req.session.userId) {
    return res.status(401).send({ error: "Not logged in" });
  }

  if (!event) {
    return res.status(404).send({ error: "Event not found" });
  }

  if (event.user_id !== req.session.userId) {
    return res.status(403).send({ error: "Forbidden" });
  }

  const deleted = await eventModel.remove(req.params.event_id);
  res.send(deleted);
};

const getUserEvents = async (req, res) => {
  const events = await eventModel.findByUser(req.params.user_id);
  res.send(events);
};

module.exports = { list, create, update, remove, getUserEvents };