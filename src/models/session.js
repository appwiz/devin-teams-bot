/**
 * Simple in-memory storage for user sessions
 * In a production environment, this would be replaced with a database
 */
class SessionStore {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Store a user's Devin session
   * @param {string} userId - Teams user ID
   * @param {string} sessionId - Devin session ID
   */
  saveSession(userId, sessionId) {
    this.sessions.set(userId, sessionId);
  }

  /**
   * Get a user's Devin session
   * @param {string} userId - Teams user ID
   * @returns {string|null} - Devin session ID or null if not found
   */
  getSession(userId) {
    return this.sessions.get(userId) || null;
  }

  /**
   * Check if a user has an active session
   * @param {string} userId - Teams user ID
   * @returns {boolean} - Whether the user has an active session
   */
  hasSession(userId) {
    return this.sessions.has(userId);
  }

  /**
   * Remove a user's session
   * @param {string} userId - Teams user ID
   */
  removeSession(userId) {
    this.sessions.delete(userId);
  }

  /**
   * Get all active sessions
   * @returns {Map} - Map of user IDs to session IDs
   */
  getAllSessions() {
    return this.sessions;
  }
}

module.exports = new SessionStore();
