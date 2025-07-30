import express from 'express';
import {inviteStaff, login, registerOwner} from '../services/authService.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const {email, password, restaurantName} = req.body;
        const result = await registerOwner(email, password, restaurantName);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const result = await login(email, password);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

router.post('/invite-staff', async (req, res) => {
    try {
        const {email, restaurantId} = req.body;
        const result = await inviteStaff(email, restaurantId);
        res.json(result);
    } catch (e) {
        res.status(400).json({error: e.message});
    }
});

export default router;