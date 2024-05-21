const db = require("../config/db");

function createUser(req, res) {
    db.query(
        'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
        [req.body.username, req.body.password, req.body.role],
        (error, results) => {
            if (error) {
                //   callback(error, null);
                return;
            }

            res.json({ message: "Created!" })
            // callback(null, results.insertId);
        }
    );
}


module.exports = { createUser };