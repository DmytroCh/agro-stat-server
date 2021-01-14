import pool from "./dbConnector"

const dbConnect = () => {
    pool.connect((err, client, done) => {
        // if (err) throw new Error(err);
        console.log('Connected');
      });
}