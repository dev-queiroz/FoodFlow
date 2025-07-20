import {NextFunction, Request, Response} from 'express';
import {supabase} from '../config/supabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        console.log('authMiddleware: Cabeçalho Authorization:', authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: 'Token de autenticação ausente ou inválido'});
        }

        const token = authHeader.split(' ')[1];
        console.log('authMiddleware: Token extraído:', token);

        const {data, error} = await supabase.auth.getUser(token);
        if (error || !data.user) {
            console.error('authMiddleware: Erro ao verificar token:', error?.message);
            return res.status(401).json({message: 'Token inválido'});
        }

        (req as any).userId = data.user.id;
        console.log('authMiddleware: Usuário autenticado, userId:', data.user.id);
        next();
    } catch (err: any) {
        console.error('authMiddleware: Erro inesperado:', err.message);
        return res.status(500).json({message: 'Erro interno do servidor'});
    }
};