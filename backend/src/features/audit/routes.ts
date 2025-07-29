// src/features/audit/routes.ts

import {Router} from 'express';
import {AuditController} from './AuditController';
import {schemas, validate} from '@shared/middlewares';

const router = Router();

router.post('/', validate(schemas.createAuditLog), AuditController.createAuditLog);

export default router;
