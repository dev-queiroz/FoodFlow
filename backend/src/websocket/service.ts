import {createClient} from '@supabase/supabase-js';
import {WebSocket, WebSocketServer} from 'ws';

interface OrderNotification {
    id: string;
    session_id: string;
    restaurant_id: string;
    menu_item_id: string;
    quantity: number;
    status: string;
    created_at: string;
}

export class WebSocketService {
    private wss: WebSocketServer;
    private supabaseClient: any;

    constructor(server: any) {
        this.wss = new WebSocketServer({server});
        this.supabaseClient = createClient(
            process.env.SUPABASE_URL!,
            process.env.SUPABASE_ANON_KEY!
        );

        this.setupWebSocket();
        this.setupRealtime();
    }

    private setupWebSocket() {
        this.wss.on('connection', (ws: WebSocket) => {
            console.log('Novo cliente WebSocket conectado');

            ws.on('message', (message: string) => {
                console.log('Mensagem recebida:', message);
            });

            ws.on('close', () => {
                console.log('Cliente WebSocket desconectado');
            });
        });
    }

    private setupRealtime() {
        const channel = this.supabaseClient.channel('new_order');

        channel
            .on(
                'postgres_changes',
                {event: 'INSERT', schema: 'public', table: 'orders'},
                (payload: any) => {
                    const notification: OrderNotification = payload.new;
                    this.broadcast(notification);
                }
            )
            .subscribe();

        console.log('Supabase Realtime configurado para tabela orders');
    }

    private broadcast(notification: OrderNotification) {
        this.wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(notification));
            }
        });
    }
}