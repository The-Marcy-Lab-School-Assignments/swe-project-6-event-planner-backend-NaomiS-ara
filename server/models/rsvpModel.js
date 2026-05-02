const pool = require('../db/pool');

const create = async (userId, eventId) => {
  const result = await pool.query(`
    INSERT INTO rsvps (user_id, event_id)
    VALUES ($1,$2)
    ON CONFLICT DO NOTHING
    RETURNING *;
  `, [userId, eventId]);

  return result.rows[0] || null;
};

const remove = async (userId, eventId) => {
  const result = await pool.query(`
    DELETE FROM rsvps
    WHERE user_id = $1 AND event_id = $2
    RETURNING *;
  `, [userId, eventId]);

  return result.rows[0] || null;
};

const findEventsByUser = async (userId) => {
  const result = await pool.query(`
    SELECT 
      events.*,
      users.username,
      COUNT(rsvps.rsvp_id) AS rsvp_count
    FROM rsvps
    JOIN events ON rsvps.event_id = events.event_id
    JOIN users ON events.user_id = users.user_id
    LEFT JOIN rsvps AS all_rsvps ON events.event_id = all_rsvps.event_id
    WHERE rsvps.user_id = $1
    GROUP BY events.event_id, users.username
    ORDER BY events.date ASC;
  `, [userId]);

  return result.rows;
};

// This finds all events a user has RSVPed to by joining the rsvps table with events. 
// It also joins users to include the event creator’s username and counts total RSVPs per event

module.exports = {
  create,
  remove,
  findEventsByUser
};