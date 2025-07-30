import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/authRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import { authenticateToken, authorizeRole } from './middlewares/authMiddleware';

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// 🔐 Middleware de autenticação
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({error: 'Token não fornecido'});

    jwt.verify(token, process.env.SUPABASE_JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({error: 'Token inválido ou expirado'});
        req.user = user;
        next();
    });
}

// 🔒 Protegendo rotas sensíveis
app.use('/restaurants', authenticateToken, authorizeRole('owner'), restaurantRoutes);
app.use('/menu', authenticateToken, authorizeRole('owner', 'staff'), menuRoutes);
app.use('/orders', authenticateToken, authorizeRole('owner', 'staff'), orderRoutes);
app.use('/sessions', sessionRoutes);

// Rotas públicas
app.use('/auth', authRoutes);

// Health Check
app.get('/', (req, res) => {
    res.json({message: 'FoodFlow Backend is running 🚀'});
});

// Tratamento global de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({error: 'Erro interno no servidor'});
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ FoodFlow backend running on http://localhost:${PORT}`));
