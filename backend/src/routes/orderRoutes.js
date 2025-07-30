import express from 'express';
import {createOrder, getOrder, listOrders, updateOrderStatus} from '../services/orderService.js';

const router = express.Router();

// Cliente cria pedido via sessão
router.post('/customer', async (req, res) => {
    try {
        const {sessionId, items} = req.body;
        const result = await createOrder(sessionId, items);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

// Garçom cria pedido em nome de cliente
router.post('/staff', async (req, res) => {
    try {
        const {sessionId, customerId, items} = req.body;
        const result = await createOrder(sessionId, items, customerId);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.put('/:orderId/status', async (req, res) => {
    try {
        const result = await updateOrderStatus(req.params.orderId, req.body.status);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.get('/:restaurantId', async (req, res) => {
    try {
        const result = await listOrders(req.params.restaurantId);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.get('/order/:orderId', async (req, res) => {
    try {
        const result = await getOrder(req.params.orderId);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

export default router;
