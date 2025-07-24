import {supabase} from '../../config/supabase';
import {
    InventoryReport,
    OccupancyReport,
    OrderItemWithMenu,
    ReportFilter,
    SalesReport,
    SessionReport
} from './interfaces';
import PDFDocument from 'pdfkit';
import {createObjectCsvStringifier} from 'csv-writer';
import {PassThrough} from 'stream';

export class ReportService {
    async generateSalesReport(restaurantId: string, ownerId: string, filter: ReportFilter): Promise<SalesReport> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        let query = supabase
            .from('orders')
            .select('total, id')
            .eq('restaurant_id', restaurantId)
            .eq('status', 'completed');

        if (filter.start_date) {
            query = query.gte('created_at', filter.start_date);
        }
        if (filter.end_date) {
            query = query.lte('created_at', filter.end_date);
        }

        const {data: orders, error: ordersError} = await query;
        if (ordersError) {
            console.error('Erro ao buscar pedidos:', ordersError.message);
            throw new Error(`Erro ao buscar pedidos: ${ordersError.message}`);
        }

        const totalSales = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        const orderCount = orders.length;
        const averageOrderValue = orderCount > 0 ? totalSales / orderCount : 0;

        const {data: topItems, error: itemsError} = await supabase
            .from('order_items')
            .select('item_id, quantity, price, menu_items!inner(name)')
            .in('order_id', orders.map(order => order.id)) as unknown as { data: OrderItemWithMenu[], error: any };
        if (itemsError) {
            console.error('Erro ao buscar itens:', itemsError.message);
            throw new Error(`Erro ao buscar itens: ${itemsError.message}`);
        }

        const topItemsAggregated = topItems.reduce((acc, item) => {
            const existing = acc.find(i => i.item_id === item.item_id);
            if (existing) {
                existing.quantity_sold += item.quantity;
                existing.total_revenue += item.quantity * item.price;
            } else {
                acc.push({
                    item_id: item.item_id,
                    name: item.menu_items.name,
                    quantity_sold: item.quantity,
                    total_revenue: item.quantity * item.price,
                });
            }
            return acc;
        }, [] as { item_id: string; name: string; quantity_sold: number; total_revenue: number }[]);

        topItemsAggregated.sort((a, b) => b.quantity_sold - a.quantity_sold);

        return {
            total_sales: totalSales,
            order_count: orderCount,
            average_order_value: averageOrderValue,
            top_items: topItemsAggregated.slice(0, 5),
        };
    }

    async generateOccupancyReport(restaurantId: string, ownerId: string, filter: ReportFilter): Promise<OccupancyReport> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        let query = supabase
            .from('sessions')
            .select('start_time, end_time')
            .eq('restaurant_id', restaurantId)
            .not('end_time', 'is', null);

        if (filter.start_date) {
            query = query.gte('start_time', filter.start_date);
        }
        if (filter.end_date) {
            query = query.lte('start_time', filter.end_date);
        }

        const {data: sessions, error: sessionsError} = await query;
        if (sessionsError) {
            console.error('Erro ao buscar sessões:', sessionsError.message);
            throw new Error(`Erro ao buscar sessões: ${sessionsError.message}`);
        }

        const totalSessions = sessions.length;
        const totalDuration = sessions.reduce((sum, session) => {
            const start = new Date(session.start_time).getTime();
            const end = new Date(session.end_time).getTime();
            return sum + (end - start);
        }, 0);
        const averageSessionDuration = totalSessions > 0 ? totalDuration / totalSessions / 1000 / 60 : 0;

        const {count: tableCount, error: tableError} = await supabase
            .from('tables')
            .select('id', {count: 'exact'})
            .eq('restaurant_id', restaurantId);
        if (tableError) {
            console.error('Erro ao contar mesas:', tableError.message);
            throw new Error(`Erro ao contar mesas: ${tableError.message}`);
        }

        return {
            total_sessions: totalSessions,
            average_session_duration: averageSessionDuration,
            table_count: tableCount || null,
        };
    }

    async generateSessionReport(restaurantId: string, ownerId: string, filter: ReportFilter): Promise<SessionReport> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        let query = supabase
            .from('session_reports')
            .select('restaurant_id, table_id, report_date, session_count, total_duration, order_count')
            .eq('restaurant_id', restaurantId);

        if (filter.start_date) {
            query = query.gte('report_date', filter.start_date);
        }
        if (filter.end_date) {
            query = query.lte('report_date', filter.end_date);
        }

        const {data: reports, error: reportsError} = await query;
        if (reportsError) {
            console.error('Erro ao buscar relatórios de sessões:', reportsError.message);
            throw new Error(`Erro ao buscar relatórios de sessões: ${reportsError.message}`);
        }

        const formattedReports = reports.map(report => ({
            ...report,
            total_duration: parseFloat(report.total_duration.match(/[\d.]+/)?.[0] || '0') / 60, // Converter para minutos
        }));

        const totalSessions = formattedReports.reduce((sum, report) => sum + report.session_count, 0);
        const totalOrders = formattedReports.reduce((sum, report) => sum + report.order_count, 0);

        return {
            reports: formattedReports,
            total_sessions: totalSessions,
            total_orders: totalOrders,
        };
    }

    async generateInventoryReport(restaurantId: string, ownerId: string, filter: ReportFilter): Promise<InventoryReport> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        let query = supabase
            .from('inventory')
            .select('id, name, quantity, unit, minimum_stock')
            .eq('restaurant_id', restaurantId);

        if (filter.start_date) {
            query = query.gte('updated_at', filter.start_date);
        }
        if (filter.end_date) {
            query = query.lte('updated_at', filter.end_date);
        }

        const {data: inventory, error: inventoryError} = await query;
        if (inventoryError) {
            console.error('Erro ao buscar estoque:', inventoryError.message);
            throw new Error(`Erro ao buscar estoque: ${inventoryError.message}`);
        }

        const items = inventory.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            unit: item.unit,
            minimum_stock: item.minimum_stock,
            needs_restock: item.quantity < item.minimum_stock,
        }));

        const lowStockCount = items.filter(item => item.needs_restock).length;

        return {
            items,
            low_stock_count: lowStockCount,
        };
    }

    async generateSalesReportPDF(report: SalesReport): Promise<Buffer> {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];
        const stream = new PassThrough();

        doc.pipe(stream);
        doc.fontSize(20).text('Relatório de Vendas', {align: 'center'});
        doc.moveDown();
        doc.fontSize(12).text(`Total de Vendas: R$${report.total_sales.toFixed(2)}`);
        doc.text(`Número de Pedidos: ${report.order_count}`);
        doc.text(`Valor Médio por Pedido: R$${report.average_order_value.toFixed(2)}`);
        doc.moveDown();
        doc.text('Itens Mais Vendidos:');
        report.top_items.forEach(item => {
            doc.text(`- ${item.name}: ${item.quantity_sold} unidades, R$${item.total_revenue.toFixed(2)}`);
        });
        doc.end();

        stream.on('data', chunk => buffers.push(chunk));
        return new Promise(resolve => stream.on('end', () => resolve(Buffer.concat(buffers))));
    }

    async generateOccupancyReportPDF(report: OccupancyReport): Promise<Buffer> {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];
        const stream = new PassThrough();

        doc.pipe(stream);
        doc.fontSize(20).text('Relatório de Ocupação', {align: 'center'});
        doc.moveDown();
        doc.fontSize(12).text(`Total de Sessões: ${report.total_sessions}`);
        doc.text(`Duração Média das Sessões: ${report.average_session_duration.toFixed(2)} minutos`);
        doc.text(`Número de Mesas: ${report.table_count ?? 'N/A'}`);
        doc.end();

        stream.on('data', chunk => buffers.push(chunk));
        return new Promise(resolve => stream.on('end', () => resolve(Buffer.concat(buffers))));
    }

    async generateSessionReportPDF(report: SessionReport): Promise<Buffer> {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];
        const stream = new PassThrough();

        doc.pipe(stream);
        doc.fontSize(20).text('Relatório de Sessões', {align: 'center'});
        doc.moveDown();
        doc.fontSize(12).text(`Total de Sessões: ${report.total_sessions}`);
        doc.text(`Total de Pedidos: ${report.total_orders}`);
        doc.moveDown();
        doc.text('Relatórios por Mesa e Data:');
        report.reports.forEach(r => {
            doc.text(`- Mesa ${r.table_id}, Data ${r.report_date}: ${r.session_count} sessões, ${r.total_duration.toFixed(2)} min, ${r.order_count} pedidos`);
        });
        doc.end();

        stream.on('data', chunk => buffers.push(chunk));
        return new Promise(resolve => stream.on('end', () => resolve(Buffer.concat(buffers))));
    }

    async generateInventoryReportPDF(report: InventoryReport): Promise<Buffer> {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];
        const stream = new PassThrough();

        doc.pipe(stream);
        doc.fontSize(20).text('Relatório de Estoque', {align: 'center'});
        doc.moveDown();
        doc.fontSize(12).text(`Itens com Estoque Baixo: ${report.low_stock_count}`);
        doc.moveDown();
        doc.text('Itens em Estoque:');
        report.items.forEach(item => {
            doc.text(`- ${item.name}: ${item.quantity} ${item.unit} ${item.needs_restock ? '(Reposição Necessária)' : ''}`);
        });
        doc.end();

        stream.on('data', chunk => buffers.push(chunk));
        return new Promise(resolve => stream.on('end', () => resolve(Buffer.concat(buffers))));
    }

    async generateSalesReportCSV(report: SalesReport): Promise<string> {
        const csvStringifier = createObjectCsvStringifier({
            header: [
                {id: 'total_sales', title: 'Total de Vendas'},
                {id: 'order_count', title: 'Número de Pedidos'},
                {id: 'average_order_value', title: 'Valor Médio por Pedido'},
                {id: 'top_items', title: 'Itens Mais Vendidos'},
            ],
        });

        const topItemsStr = report.top_items.map(item => `${item.name}: ${item.quantity_sold} unidades, R$${item.total_revenue.toFixed(2)}`).join('; ');

        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords([
            {
                total_sales: `R$${report.total_sales.toFixed(2)}`,
                order_count: report.order_count,
                average_order_value: `R$${report.average_order_value.toFixed(2)}`,
                top_items: topItemsStr,
            },
        ]);
    }

    async generateOccupancyReportCSV(report: OccupancyReport): Promise<string> {
        const csvStringifier = createObjectCsvStringifier({
            header: [
                {id: 'total_sessions', title: 'Total de Sessões'},
                {id: 'average_session_duration', title: 'Duração Média das Sessões (min)'},
                {id: 'table_count', title: 'Número de Mesas'},
            ],
        });

        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords([
            {
                total_sessions: report.total_sessions,
                average_session_duration: report.average_session_duration.toFixed(2),
                table_count: report.table_count ?? 'N/A',
            },
        ]);
    }

    async generateSessionReportCSV(report: SessionReport): Promise<string> {
        const csvStringifier = createObjectCsvStringifier({
            header: [
                {id: 'restaurant_id', title: 'Restaurante ID'},
                {id: 'table_id', title: 'Mesa ID'},
                {id: 'report_date', title: 'Data do Relatório'},
                {id: 'session_count', title: 'Contagem de Sessões'},
                {id: 'total_duration', title: 'Duração Total (min)'},
                {id: 'order_count', title: 'Contagem de Pedidos'},
            ],
        });

        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(
            report.reports.map(r => ({
                restaurant_id: r.restaurant_id,
                table_id: r.table_id,
                report_date: r.report_date,
                session_count: r.session_count,
                total_duration: r.total_duration.toFixed(2),
                order_count: r.order_count,
            }))
        );
    }

    async generateInventoryReportCSV(report: InventoryReport): Promise<string> {
        const csvStringifier = createObjectCsvStringifier({
            header: [
                {id: 'name', title: 'Nome do Item'},
                {id: 'quantity', title: 'Quantidade'},
                {id: 'unit', title: 'Unidade'},
                {id: 'minimum_stock', title: 'Estoque Mínimo'},
                {id: 'needs_restock', title: 'Reposição Necessária'},
            ],
        });

        return csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(
            report.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                unit: item.unit,
                minimum_stock: item.minimum_stock,
                needs_restock: item.needs_restock ? 'Sim' : 'Não',
            }))
        );
    }
}