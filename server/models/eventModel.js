const pool = require('../db/pool'); // import the database connection so i can run queries

const list = async () => { // async func called list that will get all events. async allows us to use await. this func will return data from the database
  const result = await pool.query(` 
    SELECT
      events.*,
      users.username,
      COUNT(rsvps.rsvp_id) AS rsvp_count
    FROM events
    JOIN users ON events.user_id = users.user_id 
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    GROUP BY events.event_id, users.username
    ORDER BY date ASC;
  `); // run a SQL query using our database connection. pool.query() = send a sql to postgreSQL. await = wait for the database to respond before continuing

  return result.rows; // returns the actual data not metadata
}; // ^ selects all columns from the events table 
// users.username to ensure username from the users table is included.
// COUNT(rsvps.rsvp_id) AS rsvp_count = count how many RSVPS each event has. COUNT = counts rows. AS rsvp_count = rename the result
// JOIN users ON events.user_id = users.user_id : connect events to users. each event has a user_id. this gets the usernamme of thw event creator. this JOIN lets me show who created the event
// LEFT JOIN : so events without rsvps still appear
// GROUP BY : group by lets me count rsvps per event instead of across all events
// ORDER BY sort events by date (earliest first)

// “This function queries the database to return all events.
//  It joins the users table to include the creator’s username, 
// and left joins the rsvps table to count how many RSVPs each event has. 
// It groups by event to calculate the counts correctly and sorts the events by date.”



// create event
const create = async (event, userId) => { // creates a function that inserts a new event
  const { title, description, date, location, event_type, max_capacity } = event; // pull fields out of the event object. this is destructuring the event object for easier access

  const result = await pool.query(` 
    INSERT INTO events (title, description, date, location, event_type, max_capacity, user_id)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *; 
  `, [title, description, date, location, event_type, max_capacity, userId]);

  return result.rows[0];
};

// update event
const update = async (eventId, fields) => {
  const keys = Object.keys(fields);

  const setString = keys
    .map((key, i) => `${key} = $${i + 1}`)
    .join(", ");

  const values = Object.values(fields);

  const result = await pool.query(`
    UPDATE events
    SET ${setString}
    WHERE event_id = $${keys.length + 1}
    RETURNING *;
  `, [...values, eventId]);

  return result.rows[0];
};

// delete event
 const remove = async (eventId) => {
  const result = await pool.query(`
    DELETE FROM events
    WHERE event_id = $1
    RETURNING *;
  `, [eventId]);

  return result.rows[0];
};

const findById = async (eventId) => {
  const result = await pool.query(`
    SELECT * FROM events
    WHERE event_id = $1;
  `, [eventId]);

  return result.rows[0];
}; // retrieves a single event by its id
//  so I can check ownership or confirm it exists before updating or deleting

const findByUser = async (userId) => {
  const result = await pool.query(`
    SELECT 
      events.*,
      COUNT(rsvps.rsvp_id) AS rsvp_count
    FROM events
    LEFT JOIN rsvps ON events.event_id = rsvps.event_id
    WHERE events.user_id = $1
    GROUP BY events.event_id
    ORDER BY date ASC;
  `, [userId]);

  return result.rows;
};

module.exports = {
  list,
  create,
  update,
  remove,
  findById,
  findByUser
};