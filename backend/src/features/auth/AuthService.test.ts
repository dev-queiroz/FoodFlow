import {AuthService} from './AuthService';
import {supabase, supabaseAdmin} from "../../shared/config/database";

// Mock do Supabase
jest.mock('@shared/config/database');

describe('AuthService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('registerRestaurant', () => {
        it('should register a restaurant successfully', async () => {
            const mockUser = {id: 'user-123', email: 'test@restaurant.com'};
            const mockSession = {
                access_token: 'access-token',
                refresh_token: 'refresh-token'
            };
            const mockRestaurant = {
                id: 'restaurant-123',
                name: 'Test Restaurant'
            };

            (supabase.auth.signUp as jest.Mock).mockResolvedValue({
                data: {user: mockUser},
                error: null
            });

            (supabaseAdmin.from as jest.Mock).mockReturnValue({
                insert: jest.fn().mockReturnValue({
                    select: jest.fn().mockReturnValue({
                        single: jest.fn().mockResolvedValue({
                            data: mockRestaurant,
                            error: null
                        })
                    })
                })
            });

            (supabase.auth.getSession as jest.Mock).mockResolvedValue({
                data: {session: mockSession}
            });

            const result = await AuthService.registerRestaurant({
                name: 'Test Restaurant',
                email: 'test@restaurant.com',
                password: 'password123'
            });

            expect(result.user.email).toBe('test@restaurant.com');
            expect(result.user.role).toBe('restaurant_owner');
            expect(result.access_token).toBe('access-token');
        });

        it('should throw error if user creation fails', async () => {
            (supabase.auth.signUp as jest.Mock).mockResolvedValue({
                data: {user: null},
                error: {message: 'User creation failed'}
            });

            await expect(
                AuthService.registerRestaurant({
                    name: 'Test Restaurant',
                    email: 'test@restaurant.com',
                    password: 'password123'
                })
            ).rejects.toThrow('User creation failed');
        });
    });

    describe('login', () => {
        it('should login successfully', async () => {
            const mockUser = {id: 'user-123', email: 'test@restaurant.com'};
            const mockSession = {
                access_token: 'access-token',
                refresh_token: 'refresh-token',
                expires_in: 3600
            };

            (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
                data: {user: mockUser, session: mockSession},
                error: null
            });

            (supabase.from as jest.Mock).mockReturnValue({
                select: jest.fn().mockReturnValue({
                    eq: jest.fn().mockReturnValue({
                        eq: jest.fn().mockReturnValue({
                            single: jest.fn().mockResolvedValue({
                                data: {role: 'admin'},
                                error: null
                            })
                        })
                    })
                })
            });

            const result = await AuthService.login({
                email: 'test@restaurant.com',
                password: 'password123'
            });

            expect(result.user.email).toBe('test@restaurant.com');
            expect(result.user.role).toBe('restaurant_owner');
        });
    });
});