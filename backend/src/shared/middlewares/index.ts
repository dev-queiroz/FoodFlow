import {authenticate, requireCustomer, requireStaffRole} from './auth';
import {checkSubscription} from './subscription';
import {authLimit, defaultLimit, strictLimit, webhookLimit} from './rateLimit';
import {schemas, validate} from './validation';
import {errorHandler} from './errorHandler';
import {requestLogger} from './requestLogger';

export default {
    // Auth
    authenticate,
    requireStaffRole,
    requireCustomer,

    // Subscription
    checkSubscription,

    // Rate limiting
    defaultLimit,
    strictLimit,
    authLimit,
    webhookLimit,

    // Validation
    validate,
    schemas,

    // Error handling
    errorHandler,
    requestLogger
};

// Named exports também disponíveis
export {
    authenticate,
    requireStaffRole,
    requireCustomer,
    checkSubscription,
    defaultLimit,
    strictLimit,
    authLimit,
    webhookLimit,
    validate,
    schemas,
    errorHandler,
    requestLogger
};