const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

const secretKey = process.env.JWT_SECRET;


// USer must be admin
const authenticateAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user; 

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Unauthorized Catch' });
  }
};


// User must be admin or viewer
const authenticateAdminAndViewer = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user; 

    if (req.user.role !== 'admin' && req.user.role !== 'viewer') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Unauthorized Catch' });
  }
};

// Allow everyone except viewer
const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user; 
    if (req.user.role !== 'member' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(403).json({ message: 'Unauthorized Catch' });
  }
};

module.exports = {
  authenticateUser, authenticateAdmin, authenticateAdminAndViewer
};

