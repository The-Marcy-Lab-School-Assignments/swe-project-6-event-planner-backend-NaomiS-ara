const rsvpModel = require('../models/rsvpModel');

const create = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: "Not logged in" });
  }

  const rsvp = await rsvpModel.create(
    req.session.userId,
    req.params.event_id
  );

  res.status(201).send(rsvp);
};

const remove = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send({ error: "Not logged in" });
  }

  const rsvp = await rsvpModel.remove(
    req.session.userId,
    req.params.event_id
  );

  res.send(rsvp);
};

const getUserRsvps = async (req, res) => {
  const events = await rsvpModel.findEventsByUser(req.params.user_id);
  res.send(events);
};

module.exports = { create, remove, getUserRsvps };