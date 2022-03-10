/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.name = null;
    this.username = null;
    this.token = null;
    this.status = null;
    this.password = null;
    this.date = null;
    this.isLoggedIn = null;
    Object.assign(this, data);
  }
}
export default User;
