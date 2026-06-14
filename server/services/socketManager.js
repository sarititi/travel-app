import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

// ===== אירועים שהשרת פולט =====
export const SOCKET_EVENTS = {
    // אירועים
    NEW_EVENT:       'event:new',
    EVENT_UPDATED:   'event:updated',
    EVENT_CANCELLED: 'event:cancelled',

    // מקומות
    PLACE_APPROVED:  'place:approved',
    PLACE_POPULAR:   'place:popular',   // נשלח כשמקום מגיע לסף reviews/favorites

    // מדיה
    MEDIA_UPLOADED:  'media:uploaded',
};

// אירועים שדורשים משתמש מחובר — guest לא יקבל אותם
const AUTHENTICATED_EVENTS = new Set([
    SOCKET_EVENTS.PLACE_APPROVED,
]);

let io = null;

/**
 * אתחול Socket.io על ה-HTTP server
 * נקרא פעם אחת ב-app.js
 */
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || 'http://localhost:3000',
            methods: ['GET', 'POST']
        }
    });

    // ===== אימות JWT על החיבור =====
    // טוקן תקין  → socket.user = { id, role, ... }  (מחובר)
    // אין טוקן   → socket.user = null               (guest, אירועים ציבוריים בלבד)
    // טוקן פגום  → מנתק את החיבור
    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            socket.user = null;
            return next();
        }

        try {
            socket.user = jwt.verify(token, SECRET);
            next();
        } catch {
            // טוקן פגום / פג תוקף — לא מאפשרים חיבור
            next(new Error('Invalid or expired token'));
        }
    });

    io.on('connection', (socket) => {
        // הצטרפות לחדר של מקום — ציבורי, גם guest יכול לקבל עדכוני מדיה ואירועים
        socket.on('join:place', (placeId) => {
            socket.join(`place:${placeId}`);
        });

        socket.on('leave:place', (placeId) => {
            socket.leave(`place:${placeId}`);
        });
    });

    return io;
};

/**
 * החזרת רשימת המשתמשים המחוברים כרגע (רק אלה עם טוקן תקין)
 */
export const getConnectedUsers = () => {
    if (!io) return [];
    const users = [];
    io.sockets.sockets.forEach((socket) => {
        if (socket.user) users.push({ id: socket.user.id, role: socket.user.role, username: socket.user.username });
    });
    return users;
};

/**
 * שליחת אירוע לכל הלקוחות המחוברים (כולל guests)
 * לאירועים ציבוריים בלבד — אירועים, מקומות פופולריים, מדיה חדשה
 */
export const broadcastToAll = (event, payload) => {
    if (!io) return;
    io.emit(event, payload);
};

/**
 * שליחת אירוע לכל המחוברים לחדר של מקום ספציפי
 * ציבורי — כל מי שעשה join:place יקבל
 */
export const broadcastToPlace = (placeId, event, payload) => {
    if (!io) return;
    io.to(`place:${placeId}`).emit(event, payload);
};

/**
 * שליחת אירוע למשתמשים מחוברים בלבד (לא guests)
 * לשימוש עם אירועים שדורשים הרשאה כמו PLACE_APPROVED
 */
export const broadcastToAuthenticated = (event, payload) => {
    if (!io) return;
    io.sockets.sockets.forEach((socket) => {
        if (socket.user) {
            socket.emit(event, payload);
        }
    });
};
