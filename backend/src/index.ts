import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import logger from '@shared/utils/logger';
import globalMiddlewares from '@shared/middlewares';
import {setupRoutes} from '@shared/routes';
import {setupCronJobs} from '@shared/cron';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Global middlewares
app.use(helmet());
app.use(compression());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true}));

// Logging middlewares
app.use(globalMiddlewares.requestLogger);

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0'
    });
});

// Setup routes
setupRoutes(app);

// Global error handler
app.use(globalMiddlewares.errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Setup cron jobs
setupCronJobs();

app.listen(PORT, () => {
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔒 TypeScript backend initialized`);
});

export default app;