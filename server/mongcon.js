const mongoose = require ("mongoose");

const url = process.env.MONGOLAB_URI || 'mongodb://localhost:27017';
mongoose.connect(url);

module.exports = exports = mongoose;