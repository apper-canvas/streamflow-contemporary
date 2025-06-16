const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Import mock data
import mockContent from '../mockData/content.json';

class ContentService {
  constructor() {
    this.data = [...mockContent];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const item = this.data.find(content => content.id === id);
    return item ? { ...item } : null;
  }

  async getByCategory(category) {
    await delay(250);
    const filtered = this.data.filter(content => 
      content.genre.includes(category)
    );
    return [...filtered];
  }

  async getTrending() {
    await delay(200);
    const trending = this.data
      .sort(() => 0.5 - Math.random())
      .slice(0, 12);
    return [...trending];
  }

  async getRecentlyAdded() {
    await delay(200);
    const recent = this.data
      .sort((a, b) => b.year - a.year)
      .slice(0, 12);
    return [...recent];
  }

  async searchContent(query) {
    await delay(300);
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    const results = this.data.filter(content =>
      content.title.toLowerCase().includes(searchTerm) ||
      content.description.toLowerCase().includes(searchTerm) ||
      content.genre.some(g => g.toLowerCase().includes(searchTerm))
    );
    return [...results];
  }

  async getFeatured() {
    await delay(200);
    const featured = this.data.find(content => content.featured) || this.data[0];
    return { ...featured };
  }
}

export default new ContentService();