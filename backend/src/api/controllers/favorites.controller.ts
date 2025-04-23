import { Request, Response } from 'express';
import MessageResponse from '../../interfaces/MessageResponse';

// In-memory storage for favorites
let favorites: string[] = ['Paris', 'Tokyo'];

export const getFavorites = (req: Request, res: Response<MessageResponse>) => {
  res.json({ data:favorites, message: 'Favorites fetched successfully' });
};

export const addFavorite = (req: Request, res: Response) => {
  try {
    const { city } = req.body;
  
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    if (!favorites.includes(city)) {
      favorites.push(city);
    }

    res.json({ 
      message: 'City added to favorites',
      data: favorites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};

export const deleteFavorite = (req: Request, res: Response) => {
  try {
    const { city } = req.params;
  
    favorites = favorites.filter(fav => fav !== city);

    res.json({ 
      message: 'City removed from favorites',
      data: favorites,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
  
};
