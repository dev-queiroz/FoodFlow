import {Router} from 'express';
import {OrderController} from './OrderController';
import {schemas, validate} from '@shared/middlewares';

const router = Router();

router.post('/', validate(schemas.createOrder), OrderController.createOrder);
router.put('/status', validate(schemas.updateOrderStatus), OrderController.updateOrderStatus);

export default router;
