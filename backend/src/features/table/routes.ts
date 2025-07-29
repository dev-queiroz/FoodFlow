// src/features/tables/routes.ts

import {Router} from 'express';
import {TableController} from './TableController';
import {schemas, validate} from '@shared/middlewares';

const router = Router();

router.post('/', validate(schemas.createTable), TableController.createTable);
router.put('/', validate(schemas.updateTable), TableController.updateTable);
router.get('/qrcode/:table_id', TableController.getTableQRCode);

export default router;
