import {Router} from 'express';
import {PaymentController} from './PaymentController';
import {schemas, validate} from '@shared/middlewares';

const router = Router();

router.post('/', validate(schemas.createPayment), PaymentController.createPayment);
router.put('/status', validate(schemas.updatePaymentStatus), PaymentController.updatePaymentStatus);

export default router;
