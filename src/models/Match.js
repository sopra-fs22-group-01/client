/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.id = null;
    this.matchStatus = null;
    this.players = null;

    Object.assign(this, data);
  }
}
export default User;

