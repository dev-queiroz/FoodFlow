import express from 'express';
import {addMenuItem, deleteMenuItem, listMenu, updateMenuItem} from '../services/menuService.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const {restaurantId, name, description, price} = req.body;
        const result = await addMenuItem(restaurantId, name, description, price);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.get('/:restaurantId', async (req, res) => {
    try {
        const result = await listMenu(req.params.restaurantId);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.put('/:itemId', async (req, res) => {
    try {
        const result = await updateMenuItem(req.params.itemId, req.body);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.delete('/:itemId', async (req, res) => {
    try {
        const result = await deleteMenuItem(req.params.itemId);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

export default router;