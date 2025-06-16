const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Import mock data
import mockWatchProgress from '../mockData/watchProgress.json';

class WatchProgressService {
  constructor() {
    this.data = [...mockWatchProgress];
  }

  async getAll() {
    await delay(200);
    return [...this.data];
  }

  async getByContentId(contentId) {
    await delay(200);
    const progress = this.data.find(p => p.contentId === contentId);
    return progress ? { ...progress } : null;
  }

  async updateProgress(contentId, progress, completed = false) {
    await delay(300);
    const existingIndex = this.data.findIndex(p => p.contentId === contentId);
    
    const progressData = {
      contentId,
      progress,
      lastWatched: new Date().toISOString(),
      completed
    };

    if (existingIndex >= 0) {
      this.data[existingIndex] = { ...this.data[existingIndex], ...progressData };
    } else {
      this.data.push({ id: Date.now().toString(), ...progressData });
    }

    return { ...progressData };
  }

  async getContinueWatching() {
    await delay(250);
    const continueWatching = this.data
      .filter(p => p.progress > 0 && !p.completed)
      .sort((a, b) => new Date(b.lastWatched) - new Date(a.lastWatched))
      .slice(0, 8);
    return [...continueWatching];
  }

  async markAsCompleted(contentId) {
    await delay(200);
    const existingIndex = this.data.findIndex(p => p.contentId === contentId);
    
    if (existingIndex >= 0) {
      this.data[existingIndex].completed = true;
      this.data[existingIndex].progress = 100;
      return { ...this.data[existingIndex] };
    }
    
    return null;
  }
}

export default new WatchProgressService();