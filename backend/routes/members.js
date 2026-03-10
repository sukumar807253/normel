const express = require('express');
const router = express.Router();
const pool = require('../db');

// File upload middleware is configured in server.js and attached to req.upload
// We need to use req.upload.single('file') to process file upload

// GET all members
router.get('/', async (req, res) => {
  try {
    const allUsers = await pool.query('SELECT id, name, mobile, email, file_url, role FROM users ORDER BY id ASC');
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update member (with optional file upload)
router.put('/:id', (req, res, next) => {
    const uploadSingle = req.upload.single('file');
    uploadSingle(req, res, function (err) {
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
}, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, mobile } = req.body;
    
    let updateQuery;
    let queryParams;

    if (req.file) {
      // Create file URL using filename
      const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      updateQuery = 'UPDATE users SET name = $1, mobile = $2, file_url = $3 WHERE id = $4 RETURNING id, name, mobile, email, file_url, role';
      queryParams = [name, mobile, fileUrl, id];
    } else {
      updateQuery = 'UPDATE users SET name = $1, mobile = $2 WHERE id = $3 RETURNING id, name, mobile, email, file_url, role';
      queryParams = [name, mobile, id];
    }

    const updatedUser = await pool.query(updateQuery, queryParams);

    if (updatedUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOp = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (deleteOp.rows.length === 0) {
       return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
