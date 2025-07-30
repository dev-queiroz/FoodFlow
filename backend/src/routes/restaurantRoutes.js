import express from 'express';
import {createTable, deactivateTable, listTables} from '../services/restaurantService.js';

const router = express.Router();

router.post('/table', async (req, res) => {
    try {
        const {restaurantId, code} = req.body;
        const result = await createTable(restaurantId, code);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.get('/:restaurantId/tables', async (req, res) => {
    try {
        const result = await listTables(req.params.restaurantId);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.put('/table/:tableId/deactivate', async (req, res) => {
    try {
        const result = await deactivateTable(req.params.tableId);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

export default router;