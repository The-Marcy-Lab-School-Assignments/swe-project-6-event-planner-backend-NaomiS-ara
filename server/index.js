require('dotenv').config();
const express = require('express');
const session = require('cookie-session');

const auth = require('./controllers/authControllers');
const users = require('./controllers/userControllers');
const events = require('./controllers/eventControllers');
const rsvps = require('./controllers/rsvpControllers');

const app = express();
app.use(express.json());

app.use(session({
  name: "session",
  keys: [process.env.SESSION_SECRET],
  httpOnly: true
}));

// AUTH
app.post('/api/auth/register', auth.register);
app.post('/api/auth/login', auth.login);
app.get('/api/auth/me', auth.me);
app.delete('/api/auth/logout', auth.logout);

// USERS
app.patch('/api/users/:user_id', users.update);
app.delete('/api/users/:user_id', users.remove);

// EVENTS
app.get('/api/events', events.list);
app.post('/api/events', events.create);
app.patch('/api/events/:event_id', events.update);
app.delete('/api/events/:event_id', events.remove);
app.get('/api/users/:user_id/events', events.getUserEvents);

// RSVPS
app.post('/api/events/:event_id/rsvps', rsvps.create);
app.delete('/api/events/:event_id/rsvps', rsvps.remove);
app.get('/api/users/:user_id/rsvps', rsvps.getUserRsvps);

app.listen(8080, () => {
  console.log('Server running on 8080');
});