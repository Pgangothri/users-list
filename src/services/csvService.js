const csv = require('csv-parser');
const fs = require('fs');

const handleCSVUpload = async (file, list) => {
  const users = [];
  const errors = [];

  const customPropertyTitles = list.customProperties.map((prop) => prop.title);
  const requiredFields = ['name', 'email', ...customPropertyTitles];

  return new Promise((resolve, reject) => {
    fs.createReadStream(file.path)
      .pipe(csv({ headers: requiredFields }))
      .on('data', (data) => {
        const user = {
          name: data.name,
          email: data.email,
          listId: list._id,
          customProperties: new Map(),
        };

        for (const prop of customPropertyTitles) {
          const value = data[prop] || list.customProperties.find((p) => p.title === prop).defaultValue;
          user.customProperties.set(prop, value);
        }

        users.push(user);
      })
      .on('error', (err) => {
        errors.push(err.message);
      })
      .on('end', () => {
        fs.unlinkSync(file.path);
        resolve({ users, errors });
      });
  });
};

module.exports = { handleCSVUpload };