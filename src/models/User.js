/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.username = null;
    this.token = null;
    this.password = null;
    this.date = null;
    this.isLoggedIn = null;

    this.userStatus = null;
    this.readyStatus = null;

    this.birthday = null;
    Object.assign(this, data);
  }
}
export default User;
