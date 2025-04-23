import { Request, Response } from 'express';
import MessageResponse from '../../interfaces/MessageResponse';
import { prisma } from '../../services';

// Default user ID - in a real app this would come from authentication
const DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';

export const getFavorites = async (req: Request, res: Response<MessageResponse>) => {
  try {
    const favorites = await prisma.favorite_cities.findMany({
      where: { user_id: DEFAULT_USER_ID },
      select: { city_name: true },
    });
    const cityNames = favorites.map(fav => fav.city_name);
    res.json({ data: cityNames, message: 'Favorites fetched successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { city } = req.body;
  
    if (!city) {
      return res.status(400).json({ message: 'City is required' });
    }

    try {
      const result = await prisma.favorite_cities.create({
        data: {
          city_name: city,
          user_id: DEFAULT_USER_ID,
        },
      });

      res.json({ 
        message: 'City added to favorites',
        data: result,
      });
      
    } catch (error :any) {
      res.status(400).json({ message: 'City already in favorites' }); 
    }
   
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const { city } = req.params;
  
    const result =  await prisma.favorite_cities.deleteMany({
      where: {
        user_id: DEFAULT_USER_ID,
        city_name: city,
      },
    });

    if (result.count === 0) return res.status(404).json({ message: 'City not found' });

    const updatedFavorites = await prisma.favorite_cities.findMany({
      where: { user_id: DEFAULT_USER_ID },
      select: { city_name: true },
    });

    const cityNames = updatedFavorites.map(fav => fav.city_name);

    res.json({ 
      message: 'City removed from favorites',
      data: cityNames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
