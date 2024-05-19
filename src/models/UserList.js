const mongoose = require('mongoose');

const userListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  customProperties: [
    {
      title: { type: String, required: true },
      fallbackValue: { type: String, default: '' },
    },
  ],
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const UserList = mongoose.model('UserList', userListSchema);

module.exports = UserList;