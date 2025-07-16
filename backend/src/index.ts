import express, {Request, Response} from 'express';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './features/auth/routes';
import restaurantRoutes from './features/restaurants/routes';
import userRoutes from './features/users/routes';
import tableRoutes from './features/tables/routes';
import menuRoutes from './features/menu/routes';
import sessionRoutes from './features/sessions/routes';
import orderRoutes from './features/orders/routes';
import {handleErrors} from './utils/errorHandler';

dotenv.config();

const app = express();
app.use(express.json());

// Swagger
const swaggerDocument = {
    openapi: '3.0.0',
    info: {title: 'FoodFlow API', version: '1.0.0'},
    paths: {
        '/auth/login': {
            post: {
                summary: 'Autentica um usuário',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {type: 'object', properties: {email: {type: 'string'}, password: {type: 'string'}}},
                        },
                    },
                },
                responses: {'200': {description: 'Login bem-sucedido'}, '401': {description: 'Credenciais inválidas'}},
            },
        },
        '/auth/register': {
            post: {
                summary: 'Cadastra um novo usuário',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: {type: 'string'},
                                    password: {type: 'string'},
                                    name: {type: 'string'},
                                    role_id: {type: 'string'},
                                    restaurant_id: {type: 'string', nullable: true},
                                },
                            },
                        },
                    },
                },
                responses: {'201': {description: 'Usuário cadastrado'}, '400': {description: 'Erro no cadastro'}},
            },
        },
        '/auth/reset-password': {
            post: {
                summary: 'Envia e-mail para redefinição de senha',
                requestBody: {
                    content: {'application/json': {schema: {type: 'object', properties: {email: {type: 'string'}}}}},
                },
                responses: {'200': {description: 'E-mail enviado'}, '400': {description: 'Erro ao enviar e-mail'}},
            },
        },
        '/auth/profile': {
            put: {
                summary: 'Atualiza o perfil do usuário',
                security: [{bearerAuth: []}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {type: 'object', properties: {name: {type: 'string'}, email: {type: 'string'}}},
                        },
                    },
                },
                responses: {'200': {description: 'Perfil atualizado'}, '400': {description: 'Erro ao atualizar'}},
            },
        },
        '/restaurants': {
            post: {
                summary: 'Cria um novo restaurante',
                security: [{bearerAuth: []}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {type: 'string'},
                                    description: {type: 'string', nullable: true},
                                    address: {type: 'string', nullable: true},
                                    contact_number: {type: 'string', nullable: true},
                                },
                            },
                        },
                    },
                },
                responses: {'201': {description: 'Restaurante criado'}, '400': {description: 'Erro ao criar'}},
            },
            get: {
                summary: 'Lista restaurantes do dono',
                security: [{bearerAuth: []}],
                responses: {'200': {description: 'Lista de restaurantes'}, '400': {description: 'Erro ao listar'}},
            },
        },
        '/restaurants/all': {
            get: {
                summary: 'Lista todos os restaurantes',
                responses: {'200': {description: 'Lista de restaurantes'}, '400': {description: 'Erro ao listar'}},
            },
        },
        '/restaurants/{id}': {
            put: {
                summary: 'Atualiza um restaurante',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {type: 'string', nullable: true},
                                    description: {type: 'string', nullable: true},
                                    address: {type: 'string', nullable: true},
                                    contact_number: {type: 'string', nullable: true},
                                },
                            },
                        },
                    },
                },
                responses: {'200': {description: 'Restaurante atualizado'}, '400': {description: 'Erro ao atualizar'}},
            },
            delete: {
                summary: 'Exclui um restaurante',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Restaurante excluído'}, '400': {description: 'Erro ao excluir'}},
            },
        },
        '/users/{restaurantId}': {
            get: {
                summary: 'Lista usuários de um restaurante',
                security: [{bearerAuth: []}],
                parameters: [{name: 'restaurantId', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Lista de usuários'}, '400': {description: 'Erro ao listar'}},
            },
        },
        '/users/{id}': {
            put: {
                summary: 'Atualiza um usuário',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    role_id: {type: 'string', nullable: true},
                                    restaurant_id: {type: 'string', nullable: true},
                                    is_active: {type: 'boolean', nullable: true},
                                },
                            },
                        },
                    },
                },
                responses: {'200': {description: 'Usuário atualizado'}, '400': {description: 'Erro ao atualizar'}},
            },
            delete: {
                summary: 'Exclui um usuário',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Usuário excluído'}, '400': {description: 'Erro ao excluir'}},
            },
        },
        '/tables': {
            post: {
                summary: 'Cria uma nova mesa',
                security: [{bearerAuth: []}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    restaurant_id: {type: 'string'},
                                    table_number: {type: 'integer', minimum: 1},
                                },
                            },
                        },
                    },
                },
                responses: {'201': {description: 'Mesa criada'}, '400': {description: 'Erro ao criar'}},
            },
        },
        '/tables/{restaurantId}': {
            get: {
                summary: 'Lista mesas de um restaurante',
                security: [{bearerAuth: []}],
                parameters: [{name: 'restaurantId', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Lista de mesas'}, '400': {description: 'Erro ao listar'}},
            },
        },
        '/tables/{id}': {
            put: {
                summary: 'Atualiza uma mesa',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    table_number: {type: 'integer', minimum: 1, nullable: true},
                                    status: {
                                        type: 'string',
                                        enum: ['available', 'occupied', 'reserved'],
                                        nullable: true
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {'200': {description: 'Mesa atualizada'}, '400': {description: 'Erro ao atualizar'}},
            },
            delete: {
                summary: 'Exclui uma mesa',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Mesa excluída'}, '400': {description: 'Erro ao excluir'}},
            },
        },
        '/tables/validate-qr': {
            post: {
                summary: 'Valida um QR code',
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {type: 'object', properties: {qr_code: {type: 'string'}}},
                        },
                    },
                },
                responses: {'200': {description: 'QR code validado'}, '400': {description: 'QR code inválido'}},
            },
        },
        '/menu': {
            post: {
                summary: 'Cria um novo item do cardápio',
                security: [{bearerAuth: []}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    restaurant_id: {type: 'string'},
                                    name: {type: 'string'},
                                    description: {type: 'string', nullable: true},
                                    price: {type: 'number', minimum: 0},
                                    category_id: {type: 'string'},
                                    is_available: {type: 'boolean', nullable: true},
                                },
                            },
                        },
                    },
                },
                responses: {'201': {description: 'Item criado'}, '400': {description: 'Erro ao criar'}},
            },
        },
        '/menu/{restaurantId}': {
            get: {
                summary: 'Lista itens do cardápio de um restaurante',
                parameters: [{name: 'restaurantId', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Lista de itens'}, '400': {description: 'Erro ao listar'}},
            },
        },
        '/menu/{id}': {
            put: {
                summary: 'Atualiza um item do cardápio',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: {type: 'string', nullable: true},
                                    description: {type: 'string', nullable: true},
                                    price: {type: 'number', minimum: 0, nullable: true},
                                    category_id: {type: 'string', nullable: true},
                                    is_available: {type: 'boolean', nullable: true},
                                },
                            },
                        },
                    },
                },
                responses: {'200': {description: 'Item atualizado'}, '400': {description: 'Erro ao atualizar'}},
            },
            delete: {
                summary: 'Exclui um item do cardápio',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Item excluído'}, '400': {description: 'Erro ao excluir'}},
            },
        },
        '/sessions': {
            post: {
                summary: 'Cria uma nova sessão',
                security: [{bearerAuth: []}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    table_id: {type: 'string'},
                                    client_id: {type: 'string', nullable: true},
                                },
                            },
                        },
                    },
                },
                responses: {'201': {description: 'Sessão criada'}, '400': {description: 'Erro ao criar'}},
            },
        },
        '/sessions/{restaurantId}': {
            get: {
                summary: 'Lista sessões de um restaurante',
                security: [{bearerAuth: []}],
                parameters: [{name: 'restaurantId', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Lista de sessões'}, '400': {description: 'Erro ao listar'}},
            },
        },
        '/sessions/{id}': {
            put: {
                summary: 'Atualiza uma sessão',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {type: 'string', enum: ['active', 'closed'], nullable: true},
                                },
                            },
                        },
                    },
                },
                responses: {'200': {description: 'Sessão atualizada'}, '400': {description: 'Erro ao atualizar'}},
            },
            delete: {
                summary: 'Exclui uma sessão',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Sessão excluída'}, '400': {description: 'Erro ao excluir'}},
            },
        },
        '/orders': {
            post: {
                summary: 'Cria um novo pedido',
                security: [{bearerAuth: []}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    session_id: {type: 'string'},
                                    menu_item_id: {type: 'string'},
                                    quantity: {type: 'integer', minimum: 1},
                                },
                            },
                        },
                    },
                },
                responses: {'201': {description: 'Pedido criado'}, '400': {description: 'Erro ao criar'}},
            },
        },
        '/orders/{restaurantId}': {
            get: {
                summary: 'Lista pedidos de um restaurante',
                security: [{bearerAuth: []}],
                parameters: [{name: 'restaurantId', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Lista de pedidos'}, '400': {description: 'Erro ao listar'}},
            },
        },
        '/orders/{id}': {
            put: {
                summary: 'Atualiza um pedido',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    status: {
                                        type: 'string',
                                        enum: ['pending', 'preparing', 'delivered', 'cancelled'],
                                        nullable: true
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {'200': {description: 'Pedido atualizado'}, '400': {description: 'Erro ao atualizar'}},
            },
            delete: {
                summary: 'Exclui um pedido',
                security: [{bearerAuth: []}],
                parameters: [{name: 'id', in: 'path', required: true, schema: {type: 'string'}}],
                responses: {'200': {description: 'Pedido excluído'}, '400': {description: 'Erro ao excluir'}},
            },
        },
    },
    components: {securitySchemes: {bearerAuth: {type: 'http', scheme: 'bearer', bearerFormat: 'JWT'}}},
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req: Request, res: Response) => {
    res.send('FoodFlow Backend API');
});

app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/users', userRoutes);
app.use('/tables', tableRoutes);
app.use('/menu', menuRoutes);
app.use('/sessions', sessionRoutes);
app.use('/orders', orderRoutes);

app.use(handleErrors);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});