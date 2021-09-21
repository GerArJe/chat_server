const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.BD_CNN);
    console.log('DB online');
  } catch (error) {
    console.error(error);
    throw new Error('Error database');
  }
};

module.exports = {
  dbConnection,
};
