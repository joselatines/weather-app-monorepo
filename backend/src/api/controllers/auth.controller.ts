import { Request, Response } from 'express';
import MessageResponse from '../../interfaces/MessageResponse';

export const authIndex = async (req: Request, res: Response<MessageResponse>) => {
  try {
	  res.json({
      message: 'Auth route working',
      data: ['😀', '😳', '🙄'],
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default { authIndex };
