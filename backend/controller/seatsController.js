const {getConnection} = require('../config/connection');


module.exports = {
    removeAllseats: async function (req, res){
        let connection ;
        try {
            connection = await getConnection();
            const query = "TRUNCATE TABLE seats";
            const options={
                autoCommit: true, // Commit each insert immediately
            }
            await connection.execute(query ,[], options);
            // console.log(table.rows);
            res.status(202).send("Deleted");
          } catch (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).send('Internal Server Error');
          } finally {
            if (connection) {
              try {
                // Release the connection when done
                await connection.close();
              } catch (error) {
                console.error('Error closing database connection:', error);
              }
            }
        }
    },

    GetWholeTable: async function (req, res) {
      let connection;
      try {
          connection = await getConnection();
          const result = await connection.execute("SELECT * from seats");
          const data = result.rows;
          res.status(200).json(data);
      } catch (error) {
          console.error('Error executing SQL query:', error);
          res.status(500).send('Internal Server Error');
      } finally {
          if (connection) {
              try {
                  await connection.close();
              } catch (error) {
                  console.error('Error closing database connection:', error);
              }
          }
      }
  },

    getseatswithCondition: async function (req, res){
        let connection ;
        try {
            
            connection = await getConnection();
            const query = `SELECT seats.*,seats.seat_num, seats.seat_type, seats.venue_id, seats.booked FROM seats WHERE ${req.body.condition}`;
          
            const table = await connection.execute(query);
            // console.log(table.rows);
            res.status(200).send(table);
          } catch (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).send('Internal Server Error');
          } finally {
            if (connection) {
              try {
                // Release the connection when done
                await connection.close();
              } catch (error) {
                console.error('Error closing database connection:', error);
              }
            }
        } 
    },

    AddNewseats: async function (req, res){
        let connection ;
        try {
            connection = await getConnection();
            const query = `INSERT INTO seats (seat_type, venue_id, booked) VALUES (:1, :2, :3)`;
            const binds = [ req.body.seat_type,req.body.venue_id,req.body.booked];
            const options = {
              autoCommit: true, 
            };
            
            await connection.execute(query,binds,options);
            res.status(202).send("Added");
        } 
        catch (error) {
            console.error('Error executing SQL query:', error);
            res.status(500).send('Internal Server Error');
          
        } 
        finally {
            if (connection) {
              try {
                // Release the connection when done
                await connection.close();
              } catch (error) {
                console.error('Error closing database connection:', error);
              }
            }
        }
    },

    Updateseats: async function (req, res) {
        let connection;
        try {
          connection = await getConnection();
          const binds = [
             req.body.seat_type,req.body.venue_id, req.body.booked
          ];
      
          console.log("binds -> ", binds);
          const query = `UPDATE seats SET  seat_type= :1, venue_id =:2, booked = :3 WHERE ${req.body.condition}`;
          const options = {
            autoCommit: true, // Commit each insert immediately
          }
    
          const respnse = await connection.execute(query, binds, options);
  
      
          res.status(202).send("Updated");
        } catch (error) {
          console.error("Error executing SQL query:", error);
          res.status(500).send('Internal Server Error');
        } finally {
          if (connection) {
            try {
              // Release the connection when done
              await connection.close();
            } catch (error) {
              console.error('Error closing database connection:', error);
            }
          }
        }
      },
  
  
      DeleteseatsAtID : async function (req, res){
  
        let connection ;
        try{
          connection = await getConnection();
          const query = `Delete from seats WHERE seat_num = :1`;
          const binds = [req.body.seats_id];
          const options = {
            autoCommit: true, // Commit each insert immediately
          };
  
          await connection.execute(query,binds,options);
          res.status(202).send("Deleted");
        }
        catch(error){
          console.log("Error executing SQL query:" ,error)
          res.status(500).send('Internal Server Error');
        }
        finally{
          if(connection){
            try{
              await connection.close();
            }
            catch(error){
              console.log("Error closing database connection:", error);
            }
          }
  
        }
  
      },

      DeleteseatsWithCondition : async function (req,res) {
        let connection;
        try{
          connection = await getConnection();
          const query = `Delete from seats WHERE ${req.body.condition}`;
          
          await connection.execute(query);
          res.status(202).send("Deleted");
        }

        catch(error){
          console.log("Error executing SQL query:" ,error)
          res.status(500).send('Internal Server Error');
        }
        finally{
          if(connection){
            try{
              await connection.close();
            }
            catch(error){
              console.log("Error closing database connection:", error);
            }
          }
        }
      }


}