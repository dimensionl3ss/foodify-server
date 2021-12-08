// constructor
const Users = function(User) {
  this.id = User.id;
  this.name = User.name;
  this.password = User.password;
  this.address = User.address;
  this.pin = User.pin;
  this.admin = User.admin;
};
module.exports = Users;