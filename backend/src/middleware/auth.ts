import {NextFunction, Request, Response} from 'express';
import {supabase} from '../config/supabase';

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({message: 'Token não fornecido'});
    }

    const token = authHeader.split(' ')[1];

    try {
        // Verificar token com Supabase
        const {data, error} = await supabase.auth.getUser(token);
        if (error || !data.user) {
            console.error('Erro ao validar token:', error?.message);
            return res.status(401).json({message: 'Token inválido'});
        }

        // Adicionar userId ao request
        (req as any).userId = data.user.id;
        next();
    } catch (err) {
        console.error('Erro no middleware de autenticação:', err);
        res.status(500).json({message: 'Erro interno do servidor'});
    }
}