const { getConnection } = require("../config/connection");
const ticketController = require("./ticketController");

module.exports = {
  GetWholeTable: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute("SELECT * from events");
      const data = result.rows;

      res.status(200).json(data);
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error("Error closing database connection:", error);
        }
      }
    }
  },

  removeAllEvents: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = "TRUNCATE TABLE events";
      const options = {
        autoCommit: true, // Commit each insert immediately
      };
      await connection.execute(query, [], options);
      // console.log(table.rows);
      res.status(202).send("Deleted");
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      if (connection) {
        try {
          // Release the connection when done
          await connection.close();
        } catch (error) {
          console.error("Error closing database connection:", error);
        }
      }
    }
  },

  getEventwithCondition: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();

      const { column, value } = req.body;

      // Use bind variables in the query
      const query = `SELECT * FROM events WHERE ${column} = :value`;
      const binds = { value };

      // Execute the query with bind variables
      const result = await connection.execute(query, binds);

      // Extract only the rows from the result
      const rows = result.rows;

      res.status(200).send(rows);
    } catch (error) {
      console.error("Error executing SQL query:", error.message);
      console.error("Oracle Database Error:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.error("Error closing database connection:", error);
        }
      }
    }
  },

  FindEventfromID: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const event_id = req.query.event_id;
      const query = `select event_name, event_date, venue_name, performer_name from events e,
      performers p,venues v where e.event_id =:event_id and e.performer_id = p.performer_id and
       e.venue_id = v.venue_id `;
      const binds = { event_id: event_id };

      try {
        const result = await connection.execute(query, binds);
        console.log(result.rows);
        res.status(200).send(result.rows);
      } catch (error) {
        console.error("Error executing SQL query:", error);
        res.status(500).send("Internal Server Error");
      }
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      if (connection) {
        try {
          // Release the connection when done
          await connection.close();
        } catch (error) {
          console.error("Error closing database connection:", error);
        }
      }
    }
  },

  AddNewEvent: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `INSERT INTO events (event_name, venue_id, event_date, start_time, end_time, 
        organizer_id, performer_id, event_category_id, num_of_tickets, num_of_VIP_tickets) VALUES 
        (:1, :2, :3, :4, :5,:6, :7, :8, :9, :10)`;
      const binds = [
        req.body.event_name,
        req.body.venue_id,
        req.body.event_date,
        req.body.start_time,
        req.body.end_time,
        req.body.organizer_id,
        req.body.performer_id,
        req.body.event_category_id,
        req.body.num_of_tickets,
        req.body.num_of_VIP_tickets,
      ];
      const options = {
        autoCommit: true,
      };

      // console.log(query , "aaa----------->>>>")
      await connection.execute(query, binds, options);
      res.status(202).send("Added");
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res
        .status(500)
        .send(
          "Internal Server Error. Hint: This venue may not have the capacity for that many tickets!"
        );
    } finally {
      if (connection) {
        try {
          // Release the connection when done
          await connection.close();
        } catch (error) {
          console.error("Error closing database connection:", error);
        }
      }
    }
  },

  SortEvents: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const sortByField = req.query.sortBy;

      if (
        !sortByField ||
        !["venue_id", "performer_id", "event_date"].includes(sortByField)
      ) {
        return res
          .status(400)
          .send(
            "Invalid sortBy field. Please provide 'venue', 'performer', or 'event_date'."
          );
      }

      const query = `SELECT * FROM events ORDER BY ${sortByField}`;

      const result = await connection.execute(query);
      const sortedEvents = result.rows;

      res.status(200).json(sortedEvents);
    } catch (error) {
      console.log("Error executing SQL query:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.log("Error closing database connection:", error);
        }
      }
    }
  },

  UpdateEvent: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      console.log("called");
      const event_id = req.query.event_id;
      const binds = [
        req.body.event_name,
        req.body.venue_id,
        req.body.event_date,
        req.body.start_time,
        req.body.end_time,
        req.body.organizer_id,
        req.body.performer_id,
        req.body.event_category_id,
        req.body.num_of_tickets,
        req.body.num_of_VIP_tickets,
        parseInt(event_id),
      ];

      console.log("binds -> ", binds);
      const query = `update events set event_name = :1, venue_id = :2 , event_date =:3, start_time = :4, 
      end_time =:5 , organizer_id =:6, performer_id = :7, event_category_id =:8, num_of_tickets =:9, 
      num_of_VIP_tickets =:10 where event_id = :11`;
      const options = {
        autoCommit: true,
      };

      const response = await connection.execute(query, binds, options);

      res.status(202).send("Updated!");
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      if (connection) {
        try {
          // Release the connection when done
          await connection.close();
        } catch (error) {
          console.error("Error closing database connection:", error);
        }
      }
    }
  },

  DeleteEventAtID: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `Delete from events WHERE event_id = :1`;
      const binds = [req.body.event_id];
      const options = {
        autoCommit: true, // Commit each insert immediately
      };

      await connection.execute(query, binds, options);
      res.status(202).send("Deleted!");
    } catch (error) {
      console.log("Error executing SQL query:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.log("Error closing database connection:", error);
        }
      }
    }
  },

  FindIDfromEventname: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      console.log("called");
      const event_name = req.query.event_name;

      const query = `select event_id from events where event_name =:event_name`;
      const binds = { event_name: event_name };

      try {
        const result = await connection.execute(query, binds);
        console.log(result.rows);
        res.status(200).send(result.rows);
      } catch (error) {
        console.error("Error executing SQL query:", error);
        res.status(500).send("Internal Server Error");
      }
    } catch (error) {
      console.error("Error executing SQL query:", error);
      res.status(500).send("Internal Server Error");
    } finally {
      if (connection) {
        try {
          // Release the connection when done
          await connection.close();
        } catch (error) {
          console.error("Error closing database connection:", error);
        }
      }
    }
  },
};
