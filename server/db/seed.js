require('dotenv').config();
const pool = require('./pool');
const bcrypt = require('bcrypt');

const seed = async () => {
  await pool.query(`DROP TABLE IF EXISTS rsvps, events, users CASCADE`);

  await pool.query(`
    CREATE TABLE users (
      user_id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE events (
      event_id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      event_type TEXT NOT NULL,
      max_capacity INTEGER NOT NULL,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
    );
  `);

  await pool.query(`
    CREATE TABLE rsvps (
      rsvp_id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
      event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
      UNIQUE (user_id, event_id)
    );
  `);

  // USERS
  const password = await bcrypt.hash('password123', 10);

  await pool.query(`
    INSERT INTO users (username, password_hash)
    VALUES 
      ('emily', $1),
      ('sina', $1),
      ('ish', $1);
  `, [password]);

  // EVENTS
  await pool.query(`
    INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id)
    VALUES
      ('React Workshop', 'Learn React', '2025-06-01', 'NYC', 'workshop', 30, 1),
      ('Music Festival', 'Live music', '2025-07-10', 'NJ', 'concert', 100, 2),
      ('Startup Meetup', 'Networking event', '2025-08-15', 'NYC', 'networking', 50, 3);
  `);

  // RSVPS
  await pool.query(`
    INSERT INTO rsvps (user_id, event_id)
    VALUES
      (1,1),
      (2,1),
      (3,2);
  `);

  console.log("Seeded!");
  process.exit();
};

seed();