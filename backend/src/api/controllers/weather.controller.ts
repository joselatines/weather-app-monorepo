import { Request, Response } from 'express';
import MessageResponse from '../../interfaces/MessageResponse';
import { weatherAPI } from '../../services';



export const getWeather = async (req: Request, res: Response<MessageResponse>) => {
  try {
    const { city } = req.query;
  
    if (!city) {
      return res.status(400).json({ message: 'City parameter is required' });
    }

    const weatherData = await weatherAPI.getWeather(city as string);

    if (!weatherData ) {
      return res.status(404).json({ message: 'Weather data not found', data: weatherData });  
    }

    if (weatherData.error) return res.status(400).json({ message: weatherData.error.message, data: weatherData });

    res.json({ data:weatherData, message: 'Weather data fetched successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};

export const getAutocomplete = async (req: Request, res: Response<MessageResponse>) => {
  try {
    const { query } = req.query as { query: string };
  
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const suggestions = await weatherAPI.getAutocomplete(query);

    if (!suggestions) {
      return res.status(404).json({ message: 'City suggestions not found', data: suggestions });  
    }

    if (suggestions.error) return res.status(400).json({ message: suggestions.error.message, data: suggestions });

    res.json({ data: suggestions, message: 'City suggestions fetched successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error', data: error });
  }
  
};
