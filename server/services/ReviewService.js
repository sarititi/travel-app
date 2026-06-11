import {
    createReview,
    getReviewsByPlaceId,
    getReviewById,
    updateReview,
    deleteReview,
    voteReviewHelpful,
} from '../models/ReviewModel.js';
import { REVIEW_NOT_FOUND, INVALID_RATING, DELETE_FAILED } from '../const/errorConst.js';

export const addReview = async (userId, placeId, rating, comment) => {
    if (rating < 1 || rating > 5) {
        const error = new Error(INVALID_RATING.message);
        error.status = INVALID_RATING.status;
        throw error;
    }
    return await createReview(userId, placeId, rating, comment);
};

export const getPlaceReviews = async (placeId, currentUserId = null) => {
    return await getReviewsByPlaceId(placeId, currentUserId);
};

export const editReview = async (reviewId, rating, comment) => {
    const review = await getReviewById(reviewId);
    if (!review) {
        const error = new Error(REVIEW_NOT_FOUND.message);
        error.status = REVIEW_NOT_FOUND.status;
        throw error;
    }

    if (rating < 1 || rating > 5) {
        const error = new Error(INVALID_RATING.message);
        error.status = INVALID_RATING.status;
        throw error;
    }

    const success = await updateReview(reviewId, rating, comment);
    if (!success) {
        const error = new Error('Failed to update review');
        error.status = 500;
        throw error;
    }

    return true;
};

export const removeReview = async (reviewId) => {
    const review = await getReviewById(reviewId);
    if (!review) {
        const error = new Error(REVIEW_NOT_FOUND.message);
        error.status = REVIEW_NOT_FOUND.status;
        throw error;
    }

    const success = await deleteReview(reviewId);
    if (!success) {
        const error = new Error(DELETE_FAILED.message);
        error.status = DELETE_FAILED.status;
        throw error;
    }

    return true;
};

export const helpfulVote = async (reviewId, userId, vote) => {
    const review = await getReviewById(reviewId);
    if (!review) {
        const error = new Error(REVIEW_NOT_FOUND.message);
        error.status = REVIEW_NOT_FOUND.status;
        throw error;
    }

    return await voteReviewHelpful(reviewId, userId, vote);
};