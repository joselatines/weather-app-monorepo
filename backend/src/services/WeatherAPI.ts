export default class WeatherAPI {
  private apiKey: string;

  private apiEndpoint: string;

  constructor() {
    this.apiKey = process.env.API_WEATHER_KEY!!; 
    this.apiEndpoint = process.env.API_WEATHER!!;
    
    if (!this.apiKey || !this.apiEndpoint) 
      throw new Error('API key and endpoint are required');
    
  }

  async getWeather(city: string) {
    try {
      if (!city) {
        console.error('City is required');
        return null;
      }
      const response = await fetch(`${this.apiEndpoint}/current.json?q=${city}&key=${this.apiKey}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getAutocomplete(query: string) {
    try {

      if (!query) {
        console.error('Query is required');
        return null;
      }
      const response = await fetch(`${this.apiEndpoint}/search.json?q=${query}&key=${this.apiKey}`);

      const data = await response.json();

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}