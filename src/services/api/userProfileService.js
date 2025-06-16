const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Import mock data
import mockUserProfile from '../mockData/userProfile.json';

class UserProfileService {
  constructor() {
    this.data = { ...mockUserProfile };
  }

  async getProfile() {
    await delay(200);
    return { ...this.data };
  }

  async addToWatchlist(contentId) {
    await delay(300);
    if (!this.data.watchlist.includes(contentId)) {
      this.data.watchlist.push(contentId);
    }
    return { ...this.data };
  }

  async removeFromWatchlist(contentId) {
    await delay(300);
    this.data.watchlist = this.data.watchlist.filter(id => id !== contentId);
    return { ...this.data };
  }

  async getWatchlist() {
    await delay(200);
    return [...this.data.watchlist];
  }

  async updatePreferences(preferences) {
    await delay(300);
    this.data.preferences = { ...this.data.preferences, ...preferences };
    return { ...this.data };
  }
}

export default new UserProfileService();