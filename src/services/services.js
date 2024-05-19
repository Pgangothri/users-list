const UserList = require('../models/UserList');
const fs = require('fs');
const csv = require('csv-parser');
const { sendEmail } = require('../helpers/email');

const createList = async (title, customProperties) => {
  const newUserList = new UserList({ title, customProperties });
  await newUserList.save();
  return newUserList;
};

const addUsersFromCSV = async (listId, filePath) => {
  const list = await UserList.findById(listId);
  if (!list) {
    throw new Error('List not found');
  }

  const results = [];
  const errors = [];
  let successCount = 0;
  let errorCount = 0;

  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
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
        resolve();
      })
      .on('error', (error) => {
        reject(error);
      });
  });

  return {
    successCount,
    errorCount,
    totalUsers: list.users.length,
    errors
  };
};

const sendEmailToList = async (listId, subject, body) => {
  const list = await UserList.findById(listId);
  if (!list) {
    throw new Error('List not found');
  }

  await sendEmail(list, subject, body);
  return { message: 'Emails sent successfully' };
};

module.exports = {
  createList,
  addUsersFromCSV,
  sendEmailToList
};
