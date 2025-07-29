import {supabase, supabaseAdmin} from '@shared/config/database';
import logger from '@shared/utils/logger';
import type {AuthResponse, LoginRequest, RegisterCustomerRequest, RegisterRestaurantRequest} from './types';
import type {CustomerInsert, RestaurantInsert, RestaurantStaffInsert} from '@shared/types/database';

export class AuthService {
    /**
     * Registra um novo restaurante (owner)
     */
    static async registerRestaurant(data: RegisterRestaurantRequest): Promise<AuthResponse> {
        try {
            // 1. Criar usuário no Supabase Auth
            const {data: authData, error: authError} = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                        role: 'restaurant_owner'
                    }
                }
            });

            if (authError || !authData.user) {
                throw new Error(authError?.message || 'Failed to create user');
            }

            // 2. Criar registro do restaurante
            const restaurantData: RestaurantInsert = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                subscription_status: 'active',
                last_payment_date: new Date().toISOString().split('T')[0],
                next_payment_due: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    .toISOString().split('T')[0]
            };

            const {data: restaurant, error: restaurantError} = await supabaseAdmin
                .from('restaurants')
                .insert(restaurantData)
                .select()
                .single();

            if (restaurantError || !restaurant) {
                // Rollback: deletar usuário se falhou criar restaurante
                await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
                throw new Error(restaurantError?.message || 'Failed to create restaurant');
            }

            // 3. Criar registro de staff (owner como admin)
            const staffData: RestaurantStaffInsert = {
                restaurant_id: restaurant.id,
                user_id: authData.user.id,
                name: data.name,
                email: data.email,
                role: 'admin',
                is_active: true
            };

            const {error: staffError} = await supabaseAdmin
                .from('restaurant_staff')
                .insert(staffData);

            if (staffError) {
                // Rollback: deletar usuário e restaurante
                await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
                await supabaseAdmin.from('restaurants').delete().eq('id', restaurant.id);
                throw new Error(staffError.message || 'Failed to create staff record');
            }

            // 4. Setup inicial do restaurante (categorias padrão, mesas, etc)
            await supabaseAdmin.rpc('setup_new_restaurant', {
                restaurant_id: restaurant.id
            });

            // 5. Gerar token de acesso
            const {data: session} = await supabase.auth.getSession();

            logger.info('Restaurant registered successfully', {
                restaurant_id: restaurant.id,
                user_id: authData.user.id,
                email: data.email
            });

            return {
                user: {
                    id: authData.user.id,
                    email: authData.user.email || '',
                    role: 'restaurant_owner'
                },
                access_token: session?.session?.access_token || '',
                refresh_token: session?.session?.refresh_token || '',
                expires_in: 3600
            };

        } catch (error) {
            logger.error('Error registering restaurant:', error);
            throw error;
        }
    }

    /**
     * Registra um novo cliente
     */
    static async registerCustomer(data: RegisterCustomerRequest): Promise<AuthResponse> {
        try {
            // 1. Criar usuário no Supabase Auth
            const {data: authData, error: authError} = await supabase.auth.signUp({
                email: data.email,
                password: data.password,
                options: {
                    data: {
                        name: data.name,
                        role: 'customer'
                    }
                }
            });

            if (authError || !authData.user) {
                throw new Error(authError?.message || 'Failed to create user');
            }

            // 2. Criar registro do cliente
            const customerData: CustomerInsert = {
                user_id: authData.user.id,
                name: data.name,
                email: data.email,
                phone: data.phone
            };

            const {data: customer, error: customerError} = await supabaseAdmin
                .from('customers')
                .insert(customerData)
                .select()
                .single();

            if (customerError || !customer) {
                // Rollback: deletar usuário se falhou criar cliente
                await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
                throw new Error(customerError?.message || 'Failed to create customer');
            }

            const {data: session} = await supabase.auth.getSession();

            logger.info('Customer registered successfully', {
                customer_id: customer.id,
                user_id: authData.user.id,
                email: data.email
            });

            return {
                user: {
                    id: authData.user.id,
                    email: authData.user.email || '',
                    role: 'customer'
                },
                access_token: session?.session?.access_token || '',
                refresh_token: session?.session?.refresh_token || '',
                expires_in: 3600
            };

        } catch (error) {
            logger.error('Error registering customer:', error);
            throw error;
        }
    }

    /**
     * Login de usuário
     */
    static async login(data: LoginRequest): Promise<AuthResponse> {
        try {
            const {data: authData, error: authError} = await supabase.auth.signInWithPassword({
                email: data.email,
                password: data.password
            });

            if (authError || !authData.user || !authData.session) {
                throw new Error(authError?.message || 'Invalid credentials');
            }

            // Determinar o role do usuário
            let userRole: 'restaurant_owner' | 'staff' | 'customer' = 'customer';

            // Verificar se é staff de restaurante
            const {data: staff} = await supabase
                .from('restaurant_staff')
                .select('role')
                .eq('user_id', authData.user.id)
                .eq('is_active', true)
                .single();

            if (staff) {
                userRole = staff.role === 'admin' ? 'restaurant_owner' : 'staff';
            }

            logger.info('User logged in successfully', {
                user_id: authData.user.id,
                email: data.email,
                role: userRole
            });

            return {
                user: {
                    id: authData.user.id,
                    email: authData.user.email || '',
                    role: userRole
                },
                access_token: authData.session.access_token,
                refresh_token: authData.session.refresh_token,
                expires_in: authData.session.expires_in || 3600
            };

        } catch (error) {
            logger.error('Error during login:', error);
            throw error;
        }
    }

    /**
     * Refresh token
     */
    static async refreshToken(refreshToken: string): Promise<AuthResponse> {
        try {
            const {data: authData, error: authError} = await supabase.auth.refreshSession({
                refresh_token: refreshToken
            });

            if (authError || !authData.user || !authData.session) {
                throw new Error(authError?.message || 'Invalid refresh token');
            }

            // Determinar o role do usuário
            let userRole: 'restaurant_owner' | 'staff' | 'customer' = 'customer';

            const {data: staff} = await supabase
                .from('restaurant_staff')
                .select('role')
                .eq('user_id', authData.user.id)
                .eq('is_active', true)
                .single();

            if (staff) {
                userRole = staff.role === 'admin' ? 'restaurant_owner' : 'staff';
            }

            return {
                user: {
                    id: authData.user.id,
                    email: authData.user.email || '',
                    role: userRole
                },
                access_token: authData.session.access_token,
                refresh_token: authData.session.refresh_token,
                expires_in: authData.session.expires_in || 3600
            };

        } catch (error) {
            logger.error('Error refreshing token:', error);
            throw error;
        }
    }

    /**
     * Logout
     */
    static async logout(): Promise<void> {
        try {
            const {error} = await supabase.auth.signOut();

            if (error) {
                throw new Error(error.message);
            }

            logger.info('User logged out successfully');
        } catch (error) {
            logger.error('Error during logout:', error);
            throw error;
        }
    }

    /**
     * Verificar se email já existe
     */
    static async checkEmailExists(email: string): Promise<boolean> {
        try {
            // Verificar no auth (mais confiável)
            const {data, error} = await supabaseAdmin.auth.admin.listUsers();

            if (error) {
                throw new Error(error.message);
            }

            return data.users.some(user => user.email === email);
        } catch (error) {
            logger.error('Error checking email existence:', error);
            throw error;
        }
    }
}