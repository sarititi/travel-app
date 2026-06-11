import express from 'express';
import {
    fetchItinerary,
    postItineraryPlace,
    deleteItineraryPlace,
} from '../controller/ItineraryController.js';
import { authenticateToken } from '../middleWare/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, fetchItinerary);
router.post('/', authenticateToken, postItineraryPlace);
router.delete('/:favoriteId', authenticateToken, deleteItineraryPlace);

export default router;
