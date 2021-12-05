// constructor
const Users = function(User) {
  this.name = User.name;
  this.id = User.id;
  this.password = User.password;
  this.address = User.address;
  this.pin = User.pin;
};
module.exports = Users;