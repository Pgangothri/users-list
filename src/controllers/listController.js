const UserList = require('../models/UserList');

const createList = async (req, res) => {
  try {
    const { title, customProperties } = req.body;
    const newUserList = new UserList({ title, customProperties });
    await newUserList.save();
    res.status(201).json(newUserList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create list', details: error.message });
  }
};

module.exports = { createList };
