import {Router} from 'express';
import {MenuController} from './MenuController';
import {schemas, validate} from '@shared/middlewares';

const router = Router();

router.post('/categories', validate(schemas.createCategory), MenuController.createCategory);
router.put('/categories', validate(schemas.updateCategory), MenuController.updateCategory);
router.post('/products', validate(schemas.createProduct), MenuController.createProduct);
router.put('/products', validate(schemas.updateProduct), MenuController.updateProduct);

export default router;
