import express from 'express';
import {activateTable, closeSession, createSession, getSession} from '../services/sessionService.js';

const router = express.Router();

/**
 * Inicia uma sessão em uma mesa
 * body: { tableId, customerId }
 */
router.post('/start', async (req, res) => {
    try {
        const {tableId, customerId} = req.body;
        const session = await createSession(tableId, customerId);
        res.json(session);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

/**
 * Libera manualmente uma mesa (admin/staff)
 */
router.put('/:tableId/activate', async (req, res) => {
    try {
        const table = await activateTable(req.params.tableId);
        res.json(table);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

/**
 * Obtém detalhes completos de uma sessão
 */
router.get('/:sessionId', async (req, res) => {
    try {
        const session = await getSession(req.params.sessionId);
        res.json(session);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

/**
 * Fecha uma sessão e libera mesa
 */
router.put('/:sessionId/close', async (req, res) => {
    try {
        const result = await closeSession(req.params.sessionId);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

export default router;
