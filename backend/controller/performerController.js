const { getConnection } = require("../config/connection");

module.exports = {
  removeAllPerformers: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = "TRUNCATE TABLE Performers";
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
      const result = await connection.execute("SELECT * from performers");
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

  getPerformerswithCondition: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `SELECT Performers.*,Performers.performer_id, Performers.performer_name,Performers.email, Performers.phone_number,Performers.password, Performers.city_state_country, Performers.performer_type FROM Performers WHERE ${req.body.condition}`;

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

  AddNewPerformer: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `INSERT INTO Performers (performer_name, performer_type) VALUES (:1, :2)`;
      const binds = [req.body.performer_name, req.body.performer_type];
      const options = {
        autoCommit: true,
      };

      await connection.execute(query, binds, options);
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

  UpdatePerformers: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const binds = [
        req.body.performer_name,
        req.body.email,
        req.body.phone_number,
        req.body.password,
        req.body.city_state_country,
        req.body.performer_type,
      ];

      console.log("binds -> ", binds);
      const query = `UPDATE Performers SET performer_name= :1,email =:2, phone_number =: 3,password =: 4, city_state_country =:5, performer_type = :6 WHERE ${req.body.condition}`;
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

  DeletePerformerAtID: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `Delete from Performers WHERE performer_id = :1`;
      const binds = [req.body.performer_id];
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

  DeletePerformerWithCondition: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `Delete from Performers WHERE ${req.body.condition}`;
      const binds = [
        req.body.performer_id,
        req.body.performer_name,
        req.body.email,
        req.body.phone_number,
        req.body.password,
        req.body.city_state_country,
        req.body.performer_type,
      ];
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

  FindPerformerfromID: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const perfomer_id = req.query.performer_id;
      const query = `select * from performers where performer_id =:performer_id`;
      const binds = { performer_id: perfomer_id };

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
