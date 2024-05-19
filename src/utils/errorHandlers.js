const getErrorMessage = (errors) => {
    return errors.map((error, index) => `Error ${index + 1}: ${error}`).join('\n');
  };
  const handleCSVUpload = async (file, list) => {
    return { users, errors };
  };
module.exports = { getErrorMessage, handleCSVUpload };