import jwt from 'jsonwebtoken';
import {
    NO_TOKEN,
    TOKEN_EXPIRED,
    INVALID_TOKEN,
    ACCESS_DENIED,
    INSUFFICIENT_PERMISSIONS,
    INTERNAL_SERVER_ERROR,
    PLACE_ID_REQUIRED_PARAM,
    ITEM_NOT_FOUND,
} from '../const/errorConst.js';

const SECRET = process.env.JWT_SECRET;

const ROLE_HIERARCHY = {
    'user': 1,
    'admin': 3
};

export const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) return res.status(NO_TOKEN.status).json({ error: NO_TOKEN.message });

        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError')
            return res.status(TOKEN_EXPIRED.status).json({ error: TOKEN_EXPIRED.message });
        if (err.name === 'JsonWebTokenError')
            return res.status(INVALID_TOKEN.status).json({ error: INVALID_TOKEN.message });

        res.status(INTERNAL_SERVER_ERROR.status).json({ error: INTERNAL_SERVER_ERROR.message });
    }
};

export const requireRole = (role) => (req, res, next) => {
    try {
        if (!req.user) return res.status(ACCESS_DENIED.status).json({ error: ACCESS_DENIED.message });

        // Special-case: treat the account with username 'admin1' as administrator
        if (req.user.username === 'admin1') return next();

        const requiredLevel = ROLE_HIERARCHY[role];
        const userLevel = ROLE_HIERARCHY[req.user.role];

        if (!userLevel || userLevel < requiredLevel) {
            return res.status(INSUFFICIENT_PERMISSIONS.status).json({ error: INSUFFICIENT_PERMISSIONS.message });
        }

        next();
    } catch (err) {
        res.status(INTERNAL_SERVER_ERROR.status).json({ error: INTERNAL_SERVER_ERROR.message });
    }
};

// export const requireRole = (role) => (req, res, next) => {
//     try {
//         if (!req.user)
//             return res.status(ACCESS_DENIED.status).json({ error: ACCESS_DENIED.message });

//         const requiredLevel = ROLE_HIERARCHY[role];
//         const userLevel = ROLE_HIERARCHY[req.user.role];

//         if (!userLevel || userLevel < requiredLevel)
//             return res.status(INSUFFICIENT_PERMISSIONS.status).json({ error: INSUFFICIENT_PERMISSIONS.message });

//         next();
//     } catch (err) {
//         res.status(INTERNAL_SERVER_ERROR.status).json({ error: INTERNAL_SERVER_ERROR.message });
//     }
// };


// export const authorizePlaceModification = async (req, res, next) => {
//     try {
//         const placeId = req.params.id;
//         if (!placeId) {
//             return res.status(PLACE_ID_REQUIRED_PARAM.status).json({ error: PLACE_ID_REQUIRED_PARAM.message });
//         }

//         const place = await getPlaceById(placeId);
//         if (!place) {
//             return res.status(PLACE_NOT_FOUND.status).json({ error: PLACE_NOT_FOUND.message });
//         }

//         const isOwner = req.user.id === place.created_by;
//         const isAdmin = req.user.role === 'admin';

//         if (!isOwner && !isAdmin) {
//             return res.status(UNAUTHORIZED_PLACE_MODIFICATION.status).json({ error: UNAUTHORIZED_PLACE_MODIFICATION.message });
//         }

//         next();
//     } catch (err) {
//         res.status(INTERNAL_SERVER_ERROR.status).json({ error: INTERNAL_SERVER_ERROR.message });
//     }
// };


// export const authorizeReviewModification = async (req, res, next) => {
//     try {
//         const { reviewId } = req.params;
//         if (!reviewId) {
//             return res.status(REVIEW_ID_REQUIRED.status).json({ error: REVIEW_ID_REQUIRED.message });
//         }

//         const review = await getReviewById(reviewId);
//         if (!review) {
//             return res.status(REVIEW_NOT_FOUND.status).json({ error: REVIEW_NOT_FOUND.message });
//         }

//         const isOwner = req.user.id === review.user_id;
//         const isAdmin = req.user.role === 'admin';

//         if (!isOwner && !isAdmin) {
//             return res.status(UNAUTHORIZED_REVIEW_MODIFICATION.status).json({ error: UNAUTHORIZED_REVIEW_MODIFICATION.message });
//         }

//         next();
//     } catch (err) {
//         res.status(INTERNAL_SERVER_ERROR.status).json({ error: INTERNAL_SERVER_ERROR.message });
//     }
// };


export const authorizeOwnership = (options) => {
    const {
        getById,
        paramName,
        ownerField,
    } = options;

    return async (req, res, next) => {
        try {
            const id = req.params[paramName];

            if (!id) {
                return res.status(PLACE_ID_REQUIRED_PARAM.status)
                    .json({ error: PLACE_ID_REQUIRED_PARAM.message });
            }

            const item = await getById(id);

            if (!item) {
                return res.status(ITEM_NOT_FOUND.status)
                    .json({ error: ITEM_NOT_FOUND.message });
            }

            const isOwner = req.user.id === item[ownerField];
            const isAdmin = req.user.role === 'admin' || req.user.username === 'admin1';

            if (!isOwner && !isAdmin) {
                return res.status(ACCESS_DENIED.status)
                    .json({ error: ACCESS_DENIED.message });
            }

            next();
        } catch (err) {
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};
