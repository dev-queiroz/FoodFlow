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
        console.log('authMiddleware: Resposta do Supabase:', {data, error: error?.message});
        if (error || !data.user) {
            console.error('authMiddleware: Erro ao verificar token:', error?.message);
            return res.status(401).json({message: `Token inválido: ${error?.message || 'Erro desconhecido'}`});
        }

        const {data: userData, error: userError} = await supabase
            .from('users')
            .select('id, email, name, role_id, restaurant_id, is_active')
            .eq('id', data.user.id)
            .single();

        console.log('authMiddleware: Dados do usuário:', {userData, userError: userError?.message});
        if (userError || !userData) {
            console.error('authMiddleware: Erro ao buscar usuário:', userError?.message);
            return res.status(404).json({message: 'Usuário não encontrado'});
        }

        if (!userData.is_active) {
            return res.status(403).json({message: 'Usuário inativo'});
        }

        (req as any).userId = userData.id;
        (req as any).user = {
            id: userData.id,
            email: userData.email,
            name: userData.name,
            role_id: userData.role_id,
            restaurant_id: userData.restaurant_id,
            is_active: userData.is_active,
        };
        console.log('authMiddleware: Usuário autenticado:', (req as any).user);

        next();
    } catch (err: any) {
        console.error('authMiddleware: Erro inesperado:', err.message);
        return res.status(500).json({message: 'Erro interno do servidor'});
    }
};