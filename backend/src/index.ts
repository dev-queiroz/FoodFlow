import express, {Request, Response} from 'express';
import {createServer} from 'http';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './config/swagger.json';
import fileUpload from 'express-fileupload';
import {handleErrors} from './utils/errorHandler';
import {initializeWebSocket} from './websocket';
import authRoutes from './features/auth/routes';
import restaurantRoutes from './features/restaurants/routes';
import userRoutes from './features/users/routes';
import tableRoutes from './features/tables/routes';
import menuRoutes from './features/menu/routes';
import menuItemRoutes from './features/menu-items/routes';
import inventoryRoutes from './features/inventory/routes';
import sessionRoutes from './features/sessions/routes';
import orderRoutes from './features/orders/routes';
import reportRoutes from './features/reports/routes';
import reservationRoutes from './features/reservations/routes';
import customizationRoutes from './features/customization/routes';
import qrCodeRoutes from './features/qrcodes/routes';
import notificationRoutes from './features/notifications/routes';
import feedbackRoutes from './features/feedback/routes';

dotenv.config();

const app = express();
const server = createServer(app);

app.use(fileUpload({
    limits: {fileSize: 1024 * 1024}, // 1MB limit
    abortOnLimit: true,
}));
app.use(express.json());

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota raiz
app.get('/', (req: Request, res: Response) => {
    res.send('FoodFlow Backend API');
});

// Rotas
app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/users', userRoutes);
app.use('/tables', tableRoutes);
app.use('/menu', menuRoutes);
app.use('/menu-items', menuItemRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/sessions', sessionRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);
app.use('/reservations', reservationRoutes);
app.use('/customizations', customizationRoutes);
app.use('/qr_codes', qrCodeRoutes);
app.use('/notifications', notificationRoutes);
app.use('/feedback', feedbackRoutes);

// Middleware de erros
app.use(handleErrors);

// Inicializar WebSocket
initializeWebSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});