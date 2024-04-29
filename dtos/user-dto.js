module.exports = class UserDto {
  id;
  email;
  pwd_hash;
  constructor(model) {
    this.email = model.email;
    this.id = model.id;
    this.pwd_hash = model.pwd_hash;
  }
};
