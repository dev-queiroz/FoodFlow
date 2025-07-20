import {Server} from 'http';
import {WebSocketService} from './service';

export function initializeWebSocket(server: Server) {
    new WebSocketService(server);
}