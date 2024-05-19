const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const UserList = require('../models/UserList');
const upload = require('../middleware/upload');
const { addUsersFromCSV, sendEmailToList } = require('../controllers/userController');

const Upload = multer({ dest: 'uploads/' });


router.post('/:listId/users', upload.single('file'), async (req, res) => {
  try {
    const { listId } = req.params;
    const list = await UserList.findById(listId);
    if (!list) {
      return res.status(404).json({ error: 'List not found' });
    }

    const results = [];
    const errors = [];
    let successCount = 0;
    let errorCount = 0;

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (data) => {
        const { name, email, ...customProperties } = data;
        if (!name || !email) {
          errors.push({ ...data, error: 'Missing required fields' });
          errorCount++;
          return;
        }
        const userExists = list.users.some(user => user.email === email);
        if (userExists) {
          errors.push({ ...data, error: 'Duplicate email' });
          errorCount++;
          return;
        }

        const userCustomProperties = {};
        list.customProperties.forEach(prop => {
          userCustomProperties[prop.title] = customProperties[prop.title] || prop.defaultValue;
        });

        list.users.push({ name, email, customProperties: userCustomProperties });
        successCount++;
      })
      .on('end', async () => {
        await list.save();
        res.json({
          successCount,
          errorCount,
          totalUsers: list.users.length,
          errors
        });
      });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add users' });
  }
});

router.post('/:listId/users', upload.single('file'), addUsersFromCSV);
router.post('/:listId/send-email', sendEmailToList);



module.exports = router;
