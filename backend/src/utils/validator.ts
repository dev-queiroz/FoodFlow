import {body, param, ValidationChain} from 'express-validator';

export const validateEmail = (): ValidationChain =>
    body('email').isEmail().withMessage('E-mail inválido');

export const validatePassword = (): ValidationChain =>
    body('password').isLength({min: 6}).withMessage('Senha deve ter pelo menos 6 caracteres');

export const validateName = (optional = false): ValidationChain =>
    optional
        ? body('name').optional().notEmpty().withMessage('Nome não pode ser vazio')
        : body('name').notEmpty().withMessage('Nome é obrigatório');

export const validateUUID = (field: string, optional = false): ValidationChain =>
    optional
        ? body(field).optional().isUUID().withMessage(`${field} inválido`)
        : body(field).isUUID().withMessage(`${field} inválido`);

export const validateIdParam = (): ValidationChain =>
    param('id').isUUID().withMessage('ID inválido');

export const validateText = (field: string, optional = false): ValidationChain =>
    optional
        ? body(field).optional().isString().withMessage(`${field} deve ser texto`)
        : body(field).isString().withMessage(`${field} deve ser texto`);