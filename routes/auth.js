const express = require("express");
const router = express.Router();
const { authenticateAdmin, authenticateAdminAndViewer } = require("../middlewares/verify")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const db = require("../config/db");

router.post("/create", 
authenticateAdmin, 
async (req, res) => {
  try {
    const { email, username, password, role, designation } = req.body;

    db.query(
      'SELECT * FROM users WHERE email = ?',
      [email],
      async (error, results) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: "Database query error" });
        }

        if (results.length > 0) {
          return res.status(400).json({ error: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const securePassword = await bcrypt.hash(password, salt);

        db.query(
          'INSERT INTO users (`email`, `username`, `password`, `role`, `designation`) VALUES (?, ?, ?, ?, ?)',
          [email, username, securePassword, role, designation],
          (error, results) => {
            if (error) {
              console.log(error);
              return res.status(500).json({ error: "Database insert error" });
            }

            res.json({ message: "User created successfully!" });
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const q = "SELECT * FROM users WHERE email = ?";
  db.query(q, [email], async (err, data) => {
    if (err) return res.json(err);

    if (data.length === 0) {
      return res.json({ message: "Email not found" });
    }

    const user = data[0];

    const passwordCompare = await bcrypt.compare(password, user.password);

    const userdata = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };

    const authToken = jwt.sign(userdata, process.env.JWT_SECRET);

    if (passwordCompare) {
      return res.json({
        success: true,
        message: "Login successful",
        authToken: authToken,
      });
    } else {
      return res.json({ success: false, message: "Incorrect password" });
    }
  });
});


router.get("/getmembers", authenticateAdminAndViewer, async (req, res) => {
  // const query = "SELECT id, username, email, role  FROM users WHERE role IN ('member', 'viewer')";
  const query = "SELECT id, username, email, role, designation  FROM users WHERE role IN ('member')";

  
  db.query(query, (error, results) => {
      if (error) {
          return res.status(500).json({ error: 'An error occurred while fetching members.' });
      }
      res.status(200).json(results);
  });
});



module.exports = router