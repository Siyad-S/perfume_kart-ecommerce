import { Request, Response, NextFunction } from 'express';
import { getSmartRecommendations } from '../services/ai.service';

export const recommendPerfumes = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { query, skip = 0, limit = 10 } = req.body;        

        if (!query) {
            res.status(400).json({ message: "Query string is required" });
            return;
        }

        const recommendations = await getSmartRecommendations(query, skip, limit);
        res.status(200).json({ data: recommendations });

    } catch (error) {
        next(error);
    }
};
