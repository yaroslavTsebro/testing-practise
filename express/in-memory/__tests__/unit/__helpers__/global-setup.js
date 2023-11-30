const {connectToDB} = require('./setup-db');

module.exports = function() {
  connectToDB();
};
