import {NextFunction, Request, Response} from 'express';
import {AuthService} from './AuthService';
import type {LoginRequest, RefreshTokenRequest, RegisterCustomerRequest, RegisterRestaurantRequest} from './types';
import {supabase} from "@shared/config/database";

export class AuthController {
    /**
     * POST /api/v1/auth/register/restaurant
     */
    static async registerRestaurant(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: RegisterRestaurantRequest = req.body;

            // Verificar se email já existe
            const emailExists = await AuthService.checkEmailExists(data.email);
            if (emailExists) {
                res.status(409).json({
                    success: false,
                    error: 'Email already registered'
                });
                return;
            }

            const result = await AuthService.registerRestaurant(data);

            res.status(201).json({
                success: true,
                message: 'Restaurant registered successfully',
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/register/customer
     */
    static async registerCustomer(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: RegisterCustomerRequest = req.body;

            // Verificar se email já existe
            const emailExists = await AuthService.checkEmailExists(data.email);
            if (emailExists) {
                res.status(409).json({
                    success: false,
                    error: 'Email already registered'
                });
                return;
            }

            const result = await AuthService.registerCustomer(data);

            res.status(201).json({
                success: true,
                message: 'Customer registered successfully',
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/login
     */
    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: LoginRequest = req.body;
            const result = await AuthService.login(data);

            res.json({
                success: true,
                message: 'Login successful',
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/refresh
     */
    static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {refresh_token}: RefreshTokenRequest = req.body;
            const result = await AuthService.refreshToken(refresh_token);

            res.json({
                success: true,
                message: 'Token refreshed successfully',
                data: result
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * POST /api/v1/auth/logout
     */
    static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await AuthService.logout();

            res.json({
                success: true,
                message: 'Logout successful'
            });

        } catch (error) {
            next(error);
        }
    }

    /**
     * GET /api/v1/auth/me
     */
    static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const authReq = req as any; // AuthenticatedRequest
            const user = authReq.user;

            // Buscar dados adicionais baseado no tipo de usuário
            let profile: any = {
                id: user.id,
                email: user.email
            };

            // Se é staff, buscar dados do restaurante
            const {data: staff} = await supabase
                .from('restaurant_staff')
                .select(`
          restaurant_id,
          name,
          role,
          is_active,
          restaurants (
            id,
            name,
            subscription_status
          )
        `)
                .eq('user_id', user.id)
                .eq('is_active', true)
                .single();

            if (staff) {
                profile.role = staff.role === 'admin' ? 'restaurant_owner' : 'staff';
                profile.name = staff.name;
                profile.restaurant = staff.restaurants;
            } else {
                // Verificar se é cliente
                const {data: customer} = await supabase
                    .from('customers')
                    .select('id, name, phone')
                    .eq('user_id', user.id)
                    .single();

                if (customer) {
                    profile.role = 'customer';
                    profile.name = customer.name;
                    profile.phone = customer.phone;
                    profile.customer_id = customer.id;
                }
            }

            res.json({
                success: true,
                data: profile
            });

        } catch (error) {
            next(error);
        }
    }
}