import { Request, Response } from 'express';
import MessageResponse from '../../interfaces/MessageResponse';

export const getWeather = (req: Request, res: Response<MessageResponse>) => {
  try {
    const { city } = req.query;
  
    if (!city) {
      return res.status(400).json({ message: 'City parameter is required' });
    }

    // Static weather data
    const weatherData = {
      city,
      temperature: 22,
      condition: 'Sunny',
      humidity: 65,
      wind: 10,
    };

    res.json({ data:weatherData, message: 'Weather data fetched successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};

export const getAutocomplete = (req: Request, res: Response<MessageResponse>) => {
  try {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    // Static city suggestions
    const suggestions = [
      'New York',
      'London',
      'Tokyo',
      'Paris',
      'Sydney',
    ].filter(city => 
      city.toLowerCase().includes((query as string).toLowerCase()),
    ).slice(0, 5);

    res.json({ data:suggestions, message: 'City suggestions fetched successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
    
  }
  
};
