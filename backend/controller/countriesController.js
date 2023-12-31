const { getConnection } = require("../config/connection");

module.exports = {
  removeAllCountries: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = "TRUNCATE TABLE countries";
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
      const result = await connection.execute("SELECT * from countries");
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

  getCountrieswithCondition: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `SELECT countries.*,countries.country_id, countries.country_name FROM countries WHERE ${req.body.condition}`;

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

  AddNewCountry: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `INSERT INTO countries ( country_name) VALUES ( :1)`;
      const binds = [req.body.country_name];
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

  Updatecountries: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const binds = [req.body.country_name];
      const query = `UPDATE countries SET  country_name= :1 WHERE ${req.body.condition}`;

      // console.log("binds -> ", binds);

      const options = {
        autoCommit: true, // Commit each insert immediately
      };

      await connection.execute(query, binds, options);

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

  DeleteCountriesAtID: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `Delete from countries WHERE country_id = :1`;
      const binds = [req.body.country_id];
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

  DeleteCountriesWithCondition: async function (req, res) {
    let connection;
    try {
      connection = await getConnection();
      const query = `Delete from countries WHERE ${req.body.condition}`;

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
