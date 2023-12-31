const { getConnection } = require("../config/connection");

module.exports = {
  removeAllbookings: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = "TRUNCATE TABLE bookings";
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

  GetWholeTable: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const result = await connection.execute("SELECT * from bookings");
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

  getbookingswithCondition: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `SELECT bookings.*,bookings.user_id, bookings.ticket_id, bookings.event_id, bookings.amt_paid, bookings.transaction_time FROM bookings WHERE ${req.body.condition}`;

      const table = await connection.execute(query);
      // console.log(table.rows);
      res.status(200).send(table);
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

  AddNewbookings: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `INSERT INTO bookings (user_id,event_id,ticket_id,ticket_type) VALUES (:1, :2, :3, :4)`;
      const binds = [
        req.body.user_id,
        req.body.event_id,
        req.body.ticket_id,
        req.body.ticket_type,
      ];
      const options = {
        autoCommit: true,
      };

      console.log("waiting");

      await connection.execute(query, binds, options);

      console.log("done waiting");

      res.status(202).send("Added");
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

  Updatebookings: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const binds = [req.body.country_id, req.body.country_name];

      console.log("binds -> ", binds);
      const query = `UPDATE bookings SET user_id = :1, ticket_id= :2, event_id =:3, amt_paid =:4, transaction_time =:5 WHERE ${req.body.condition}`;
      const options = {
        autoCommit: true, // Commit each insert immediately
      };

      const respnse = await connection.execute(query, binds, options);

      res.status(202).send("Updated");
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

  DeleteTransactionAtTicketID: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `Delete from bookings WHERE ticket_id = :1`;
      const binds = [req.body.countries_id];
      const options = {
        autoCommit: true, // Commit each insert immediately
      };

      await connection.execute(query, binds, options);
      res.status(202).send("Deleted");
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
  DeleteTransactionAtUserID: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `Delete from bookings WHERE user_id = :1`;
      const binds = [req.body.countries_id];
      const options = {
        autoCommit: true, // Commit each insert immediately
      };

      await connection.execute(query, binds, options);
      res.status(202).send("Deleted");
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

  DeletebookingsWithCondition: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `Delete from bookings WHERE ${req.body.condition}`;

      await connection.execute(query);
      res.status(202).send("Deleted");
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
};
