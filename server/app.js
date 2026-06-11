import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
dotenv.config();

import authRoutes      from './routes/authRoutes.js';
import placeRoutes     from './routes/placeRoute.js';
import userRoutes      from './routes/userRoutes.js';
import itineraryRoutes from './routes/itineraryRoute.js';
import { ROUTE_NOT_FOUND, INTERNAL_SERVER_ERROR } from './const/errorConst.js';


//אני מייבאת מהראוט את המודל לשים לב אם זה צריך לעבור דרך הסרוויס
//ליצור אודיו ולבדוק את המדיה

const app = express();
const httpServer = createServer(app);

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true 
}));

//  app.get('/', (req, res) => res.redirect('/places'));
 
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use('/auth',      authRoutes);
app.use('/places',    placeRoutes);
app.use('/user',      userRoutes);
// app.use('/places/:placeId/reviews', reviewRoutes);
// app.use('/places/:placeId/media', mediaRoutes);  
app.use('/itinerary', itineraryRoutes);
app.use((req, res) => {
    res.status(ROUTE_NOT_FOUND.status).json({ error: ROUTE_NOT_FOUND.message });
});

app.use((err, req, res, next) => {
    console.error(err.stack);

    const status = err.status || INTERNAL_SERVER_ERROR.status;
    const message = err.message || INTERNAL_SERVER_ERROR.message;

    res.status(status).json({
        error: message
    });
});

// initSocket(httpServer);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;
