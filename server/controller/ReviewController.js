import { addReview, getPlaceReviews, editReview, removeReview, helpfulVote } from '../services/ReviewService.js';
import { RATING_REQUIRED, RATING_MUST_BE_NUMBER } from '../const/errorConst.js';

export const postReview = async (req, res, next) => {
    try {
        const placeId = req.params.placeId || req.params.id;
        const { rating, comment } = req.body;
        const userId = req.user.id;

        if (rating === undefined || rating === null) {
            return res.status(RATING_REQUIRED.status).json({ error: RATING_REQUIRED.message });
        }

        const numericRating = Number(rating);
        if (isNaN(numericRating)) {
            return res.status(RATING_MUST_BE_NUMBER.status).json({ error: RATING_MUST_BE_NUMBER.message });
        }

        const newReview = await addReview(userId, placeId, numericRating, comment);
        res.status(201).json(newReview);
    } catch (err) {
        next(err);
    }
};

export const getReviews = async (req, res, next) => {
    try {
        const placeId = req.params.placeId || req.params.id;
        // מעביר את ה-userId כדי שהשאילתה תדע מה הצביע המשתמש הנוכחי
        const currentUserId = req.user?.id ?? null;
        const reviews = await getPlaceReviews(placeId, currentUserId);
        res.status(200).json(reviews);
    } catch (err) {
        next(err);
    }
};

export const putReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { rating, comment } = req.body;

        if (rating === undefined || rating === null) {
            return res.status(RATING_REQUIRED.status).json({ error: RATING_REQUIRED.message });
        }

        const numericRating = Number(rating);
        if (isNaN(numericRating)) {
            return res.status(RATING_MUST_BE_NUMBER.status).json({ error: RATING_MUST_BE_NUMBER.message });
        }

        await editReview(reviewId, numericRating, comment);
        res.status(200).json({ success: true, message: 'Review updated successfully' });
    } catch (err) {
        next(err);
    }
};

export const deleteReview = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        await removeReview(reviewId);
        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (err) {
        next(err);
    }
};

export const voteHelpful = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user.id;
        const { vote } = req.body; // 'up' | 'down' | null

        if (vote !== 'up' && vote !== 'down' && vote !== null) {
            return res.status(400).json({ error: 'vote חייב להיות up, down או null' });
        }

        const result = await helpfulVote(reviewId, userId, vote);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};