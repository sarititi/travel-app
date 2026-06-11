import { addPlace, getPlaces, getPlace, editPlace, removePlace } from '../services/PlaceService.js';

export const postPlace = async (req, res, next) => {
    try {
        const { name, description, categories, latitude, longitude, opening_hours } = req.body;

        const cleanCategories = Array.isArray(categories)
            ? categories
                .filter(c => typeof c === 'string')
                .map(c => c.trim())
                .filter(c => c.length > 0)
            : [];

        const newPlace = await addPlace(
            req.user.id, name, description, cleanCategories,
            latitude, longitude, opening_hours
        );

        res.status(201).json(newPlace);
    } catch (err) {
        next(err);;
    }
};

export const fetchPlaces = async (req, res, next) => {
    try {
        const { page, limit, search, category, open_on } = req.query;
        const result = await getPlaces({ page, limit, search, category, open_on });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const fetchPlaceById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const place = await getPlace(id);
        res.status(200).json(place);
    } catch (err) {
        next(err);
    }
};

export const putPlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, categories, latitude, longitude, opening_hours } = req.body;

        const cleanCategories = Array.isArray(categories)
            ? categories
                .filter(c => typeof c === 'string')
                .map(c => c.trim())
                .filter(c => c.length > 0)
            : [];

        await editPlace(
            id, name, description, cleanCategories,
            latitude, longitude, opening_hours
        );

        res.status(200).json({ success: true, message: 'Place updated successfully' });
    } catch (err) {
        next(err);
    }
};

export const deletePlace = async (req, res, next) => {
    try {
        const { id } = req.params;
        await removePlace(id);
        res.status(200).json({ success: true, message: 'Place deleted successfully' });
    } catch (err) {
        next(err);
    }
};
